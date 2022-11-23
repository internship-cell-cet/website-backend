import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const seekerSchema = new Schema({
  userId: { type: ObjectId, required: true },
  skills: [String],
  jobs: [String],
  resume: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model('Seeker', seekerSchema);
