import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const statsSchema = new Schema({
  providerId: { type: ObjectId, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: String,
  recruits: { type: Number, required: true, default: 0 },
});

export default mongoose.model('Stats', statsSchema);
