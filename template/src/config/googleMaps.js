import axios from 'axios';

export const callGoogleMapsAPI = async (endpoint, params) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/${endpoint}`, {
      params: { ...params, key: process.env.GOOGLE_MAPS_API_KEY }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Google Maps API error: ${error.response?.data?.error_message || error.message}`);
  }
};



export const geocodeAddress = async (address) => {
 const data = await callGoogleMapsAPI('geocode/json', { address });
  if (data.status === 'OK' && data.results.length > 0) {
    const location = data.results.geometry.location;
    return {
      coordinates: [location.lng, location.lat],
      formattedAddress: data.results.formatted_address,
      placeId: data.results.place_id
    };
  }
  throw new Error('Address not found');
};

export const reverseGeocode = async (lat, lng) => {
 const data = await callGoogleMapsAPI('geocode/json', { latlng: `${lat},${lng}` });
  if (data.status === 'OK' && data.results.length > 0) {
    return data.results.formatted_address;
  }
  throw new Error('Location not found');
};


// async function geocodeAddress(address) {
//   const data = await callGoogleMapsAPI('geocode/json', { address });
//   if (data.status === 'OK' && data.results.length > 0) {
//     const location = data.results.geometry.location;
//     return {
//       coordinates: [location.lng, location.lat],
//       formattedAddress: data.results.formatted_address,
//       placeId: data.results.place_id
//     };
//   }
//   throw new Error('Address not found');
// }
// async function reverseGeocode(lat, lng) {
//   const data = await callGoogleMapsAPI('geocode/json', { latlng: `${lat},${lng}` });
//   if (data.status === 'OK' && data.results.length > 0) {
//     return data.results.formatted_address;
//   }
//   throw new Error('Location not found');
// }
// async function callGoogleMapsAPI(endpoint, params) {
//   try {
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/${endpoint}`, {
//       params: { ...params, key: process.env.GOOGLE_MAPS_API_KEY }
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(`Google Maps API error: ${error.response?.data?.error_message || error.message}`);
//   }
// }
// module.exports = { callGoogleMapsAPI, geocodeAddress, reverseGeocode };
