// models/Update.js
import mongoose from 'mongoose';

const UpdateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hub: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Update || mongoose.model('Update', UpdateSchema);
