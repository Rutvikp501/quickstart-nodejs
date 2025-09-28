import mongoose from 'mongoose';
const routeSchema = new mongoose.Schema({
  name: String,
  waypoints: [{
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number]
    },
    order: Number
  }],
  optimizedOrder: [Number],
  totalDistance: String,
  totalDuration: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Route', routeSchema);
