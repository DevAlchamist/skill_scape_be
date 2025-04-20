// models/Progress.js
import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hub: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
  completedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  notes: [{ 
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    content: String,
    createdAt: { type: Date, default: Date.now },
  }],
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
