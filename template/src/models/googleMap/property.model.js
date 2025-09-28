import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  price: { type: Number, required: true },
  propertyType: { type: String, enum: ['house', 'apartment', 'condo', 'commercial'] },
  bedrooms: Number,
  bathrooms: Number,
  squareFeet: Number,
  amenities: [String],
  nearbyPlaces: [{
    name: String,
    type: String,
    distance: String
  }],
  createdAt: { type: Date, default: Date.now }
});
propertySchema.index({ location: '2dsphere' });

export default mongoose.model('Property', propertySchema);
