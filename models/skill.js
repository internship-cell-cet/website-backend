import mongoose from 'mongoose';

const { Schema } = mongoose;

const skillSchema = new Schema({
  category: { type: String, required: true },
  skills: [{
    skillCode: { type: String, required: true },
    skillName: { type: String, required: true },
  }],
});

export default mongoose.model('Skill', skillSchema);
