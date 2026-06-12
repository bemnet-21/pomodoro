import mongoose from 'mongoose';


const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  taskName: { type: String, default: 'Focus Session' },
  
  sessionType: { 
    type: String, 
    enum: ['work', 'short-break', 'long-break'], 
    required: true 
  },

  status: { 
    type: String, 
    enum: ['completed', 'abandoned'], 
    default: 'completed' 
  },

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
  actualDurationSeconds: { type: Number, required: true }, 
  plannedDurationSeconds: { type: Number, required: true },

  tags: [{ type: String, trim: true }], 

  focusRating: { type: Number, min: 1, max: 5 },
  distractions: { type: Number, default: 0 } 
}, { timestamps: true });

SessionSchema.index({ user: 1, startTime: -1 });

export default mongoose.model('Session', SessionSchema);