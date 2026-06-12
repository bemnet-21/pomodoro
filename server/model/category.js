import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  color: { type: String, default: '#FF4D00' }, 
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);