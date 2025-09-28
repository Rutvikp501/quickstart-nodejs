import express from 'express';
const router = express.Router();
import { addProperty, addStore, createDelivery, findNearbyPlaces, 
    findNearbyStores, getCommuteOptions, getDirections, optimizedRoute, 
    searchProperties, trackDelivery, updateDeliveryStatus, validateAddress } from '../controllers/googleMap/googleMap.controller.js';

router.post('/stores', addStore);
router.get('/stores/nearby', findNearbyStores);
router.post('/routes/optimize', optimizedRoute);
router.get('/routes', getDirections);
router.post('/addresses/validate', validateAddress);
router.get('/places/nearby', findNearbyPlaces);
router.post('/deliveries', createDelivery);
router.put('/deliveries/:orderId', updateDeliveryStatus);
router.get('/deliveries/:orderId/track', trackDelivery);
router.post('/properties', addProperty);
router.get('/properties/search', searchProperties);
router.get('/properties/:id/commute', getCommuteOptions);



export default router;
