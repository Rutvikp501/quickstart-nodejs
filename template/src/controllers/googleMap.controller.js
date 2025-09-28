
import Store from "../../models/googleMap/store.model.js";
import Route from "../../models/googleMap/route.model.js";
import Delivery from "../../models/googleMap/delivery.model.js";
import Property from "../../models/googleMap/property.model.js";
import { callGoogleMapsAPI,geocodeAddress } from "../../config/googleMaps.js";

// ==================== STORE FINDER ROUTES ====================

export const addStore = async (req, res) => {
try {
    const { name, address, phone, hours, category, rating, amenities } = req.body;
    
    // Geocode the address
    const geocoded = await geocodeAddress(address);
    
    const store = new Store({
      name,
      address: geocoded.formattedAddress,
      location: {
        type: 'Point',
        coordinates: geocoded.coordinates
      },
      phone,
      hours,
      category,
      rating,
      amenities
    });
    
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Add a new store


// Find stores near a location
export const findNearbyStores = async (req, res) => {
try {
    const { address, lat, lng, radius = 5000, category, limit = 10 } = req.query;
    
    let coordinates;
    if (address) {
      const geocoded = await geocodeAddress(address);
      coordinates = geocoded.coordinates;
    } else if (lat && lng) {
      coordinates = [parseFloat(lng), parseFloat(lat)];
    } else {
      return res.status(400).json({ error: 'Address or coordinates required' });
    }
    
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: parseInt(radius)
        }
      }
    };
    
    if (category) {
      query.category = category;
    }
    
    const stores = await Store.find(query).limit(parseInt(limit));
    res.json(stores);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== ROUTE PLANNING ROUTES ====================
// Create optimized route
export const optimizedRoute = async (req, res) => {
 try {
    const { name, addresses } = req.body;
    
    if (!addresses || addresses.length < 2) {
      return res.status(400).json({ error: 'At least 2 addresses required' });
    }
    
    // Geocode all addresses
    const waypoints = await Promise.all(
      addresses.map(async (address, index) => {
        const geocoded = await geocodeAddress(address);
        return {
          address: geocoded.formattedAddress,
          location: {
            type: 'Point',
            coordinates: geocoded.coordinates
          },
          order: index
        };
      })
    );
    
    // Get optimized route from Google Maps
    const origin = `${waypoints[0].location.coordinates[1]},${waypoints[0].location.coordinates[0]}`;
    const destination = `${waypoints[waypoints.length - 1].location.coordinates[1]},${waypoints[waypoints.length - 1].location.coordinates[0]}`;
    
    let waypointParams = '';
    if (waypoints.length > 2) {
      const intermediateWaypoints = waypoints.slice(1, -1).map(wp => 
        `${wp.location.coordinates[1]},${wp.location.coordinates[0]}`
      ).join('|');
      waypointParams = `optimize:true|${intermediateWaypoints}`;
    }
    
    const directionsData = await callGoogleMapsAPI('directions/json', {
      origin,
      destination,
      waypoints: waypointParams,
      optimize: true
    });
    
    if (directionsData.status === 'OK') {
      const route = directionsData.routes[0];
      const optimizedOrder = directionsData.routes[0].waypoint_order || [];
      
      const routeDoc = new Route({
        name,
        waypoints,
        optimizedOrder,
        totalDistance: route.legs.reduce((total, leg) => total + leg.distance.text, ''),
        totalDuration: route.legs.reduce((total, leg) => total + leg.duration.text, '')
      });
      
      await routeDoc.save();
      res.json({ route: routeDoc, directions: directionsData });
    } else {
      throw new Error('Route optimization failed');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get saved routes
export const getDirections = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== ADDRESS VALIDATION ROUTES ====================

// Validate address
export const validateAddress = async (req, res) => {
 try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    const geocoded = await geocodeAddress(address);
    
    // Get place details for additional validation
    const placeDetailsData = await callGoogleMapsAPI('place/details/json', {
      place_id: geocoded.placeId,
      fields: 'address_components,formatted_address,geometry,types'
    });
    
    const isValid = placeDetailsData.status === 'OK';
    const addressComponents = placeDetailsData.result?.address_components || [];
    
    res.json({
      isValid,
      originalAddress: address,
      formattedAddress: geocoded.formattedAddress,
      coordinates: geocoded.coordinates,
      addressComponents,
      types: placeDetailsData.result?.types || []
    });
  } catch (error) {
    res.status(400).json({ 
      isValid: false, 
      error: error.message,
      originalAddress: req.body.address 
    });
  }
};

// ==================== LOCATION-BASED SERVICES ROUTES ====================

// Find nearby places
export const findNearbyPlaces = async (req, res) => {
 try {
    const { lat, lng, radius = 1500, type, keyword } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const params = {
      location: `${lat},${lng}`,
      radius: parseInt(radius)
    };
    
    if (type) params.type = type;
    if (keyword) params.keyword = keyword;
    
    const placesData = await callGoogleMapsAPI('place/nearbysearch/json', params);
    
    res.json({
      places: placesData.results.map(place => ({
        placeId: place.place_id,
        name: place.name,
        rating: place.rating,
        priceLevel: place.price_level,
        types: place.types,
        vicinity: place.vicinity,
        location: place.geometry.location,
        isOpen: place.opening_hours?.open_now
      }))
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== DELIVERY TRACKING ROUTES ====================

// Create delivery
export const createDelivery = async (req, res) => {
  try {
    const { orderId, customerAddress, driverLat, driverLng } = req.body;
    
    // Geocode customer address
    const customerGeocode = await geocodeAddress(customerAddress);
    
    // Get route from driver to customer
    const directionsData = await callGoogleMapsAPI('directions/json', {
      origin: `${driverLat},${driverLng}`,
      destination: `${customerGeocode.coordinates[1]},${customerGeocode.coordinates[0]}`
    });
    
    let route = {};
    if (directionsData.status === 'OK') {
      const routeData = directionsData.routes[0];
      route = {
        distance: routeData.legs[0].distance.text,
        duration: routeData.legs[0].duration.text,
        polyline: routeData.overview_polyline.points
      };
    }
    
    const delivery = new Delivery({
      orderId,
      customerAddress: customerGeocode.formattedAddress,
      customerLocation: {
        type: 'Point',
        coordinates: customerGeocode.coordinates
      },
      driverLocation: {
        type: 'Point',
        coordinates: [parseFloat(driverLng), parseFloat(driverLat)]
      },
      route,
      estimatedDeliveryTime: route.duration || 'Unknown'
    });
    
    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update delivery status and driver location
export const updateDeliveryStatus = async (req, res) => {
 try {
    const { orderId } = req.params;
    const { status, driverLat, driverLng } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (status === 'delivered') updateData.actualDeliveryTime = new Date();
    
    if (driverLat && driverLng) {
      updateData.driverLocation = {
        type: 'Point',
        coordinates: [parseFloat(driverLng), parseFloat(driverLat)]
      };
    }
    
    const delivery = await Delivery.findOneAndUpdate(
      { orderId },
      updateData,
      { new: true }
    );
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Track delivery
export const trackDelivery = async (req, res) => {
try {
    const { orderId } = req.params;
    const delivery = await Delivery.findOne({ orderId });
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    // Calculate current route if driver location has changed
    if (delivery.status === 'in_transit') {
      const directionsData = await callGoogleMapsAPI('directions/json', {
        origin: `${delivery.driverLocation.coordinates[1]},${delivery.driverLocation.coordinates[0]}`,
        destination: `${delivery.customerLocation.coordinates[1]},${delivery.customerLocation.coordinates[0]}`
      });
      
      if (directionsData.status === 'OK') {
        const routeData = directionsData.routes[0];
        delivery.route = {
          distance: routeData.legs[0].distance.text,
          duration: routeData.legs[0].duration.text,
          polyline: routeData.overview_polyline.points
        };
      }
    }
    
    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== REAL ESTATE MAPPING ROUTES ====================

// Add property
export const addProperty = async (req, res) => {
try {
    const { title, description, address, price, propertyType, bedrooms, bathrooms, squareFeet, amenities } = req.body;
    
    // Geocode property address
    const geocoded = await geocodeAddress(address);
    
    // Find nearby places of interest
    const nearbyPlacesData = await callGoogleMapsAPI('place/nearbysearch/json', {
      location: `${geocoded.coordinates[1]},${geocoded.coordinates[0]}`,
      radius: 2000,
      type: 'school|hospital|grocery_or_supermarket|bank|gas_station'
    });
    
    const nearbyPlaces = nearbyPlacesData.results.slice(0, 10).map(place => ({
      name: place.name,
      type: place.types[0],
      distance: 'Calculating...' // You could calculate actual distance here
    }));
    
    const property = new Property({
      title,
      description,
      address: geocoded.formattedAddress,
      location: {
        type: 'Point',
        coordinates: geocoded.coordinates
      },
      price,
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      amenities,
      nearbyPlaces
    });
    
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search properties
export const searchProperties = async (req, res) => {
 try {
    const { 
      lat, lng, radius = 10000, 
      minPrice, maxPrice, 
      propertyType, bedrooms, bathrooms,
      limit = 20 
    } = req.query;
    
    const query = {};
    
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (propertyType) query.propertyType = propertyType;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (bathrooms) query.bathrooms = parseInt(bathrooms);
    
    const properties = await Property.find(query).limit(parseInt(limit));
    res.json(properties);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get property details with commute times
export const getCommuteOptions = async (req, res) => {
try {
    const { id } = req.params;
    const { workAddress } = req.query;
    
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    if (!workAddress) {
      return res.json(property);
    }
    
    // Calculate commute time
    const workGeocode = await geocodeAddress(workAddress);
    const directionsData = await callGoogleMapsAPI('directions/json', {
      origin: `${property.location.coordinates[1]},${property.location.coordinates[0]}`,
      destination: `${workGeocode.coordinates[1]},${workGeocode.coordinates[0]}`,
      mode: 'driving',
      departure_time: 'now'
    });
    
    let commuteInfo = {};
    if (directionsData.status === 'OK') {
      const route = directionsData.routes[0];
      commuteInfo = {
        distance: route.legs[0].distance.text,
        duration: route.legs[0].duration.text,
        durationInTraffic: route.legs[0].duration_in_traffic?.text || route.legs[0].duration.text
      };
    }
    
    res.json({ ...property.toObject(), commuteInfo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
