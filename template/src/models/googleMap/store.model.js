import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  phone: String,
  hours: String,
  category: String,
  rating: { type: Number, min: 0, max: 5 },
  amenities: [String],
  createdAt: { type: Date, default: Date.now }
});
storeSchema.index({ location: '2dsphere' });
export default mongoose.model('Store', storeSchema);
