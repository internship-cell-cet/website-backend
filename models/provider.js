import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const providerSchema = new Schema({
  userId: { type: ObjectId, required: true },
  description: { type: String, required: true },
  website: String,
  reviews: [{
    reviewerId: ObjectId,
    reviewerName: String,
    reviewData: String,
    rating: { type: Number, min: 0, max: 5 },
  }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model('Provider', providerSchema);
