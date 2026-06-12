import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, 
  
  settings: {
    workDuration: { type: Number, default: 25 },
    shortBreak: { type: Number, default: 5 },
    longBreak: { type: Number, default: 15 },
    longBreakInterval: { type: Number, default: 4 }, 
    autoStartBreaks: { type: Boolean, default: false },
    autoStartWork: { type: Boolean, default: false },
    alarmSound: { type: String, default: 'digital_bell' },
    volume: { type: Number, default: 50 }
  },

  stats: {
    totalFocusMinutes: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
