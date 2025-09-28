import mongoose from 'mongoose';
const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerAddress: String,
  customerLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  driverLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, enum: ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'], default: 'pending' },
  estimatedDeliveryTime: String,
  actualDeliveryTime: Date,
  route: {
    distance: String,
    duration: String,
    polyline: String
  },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Delivery', deliverySchema);
