// models/Resource.js
import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'article', 'post', 'course', 'repo', 'documentation'], 
    required: true 
  },
  description: { type: String },
  duration: { type: String }, // optional for videos/courses
  addedByAI: { type: Boolean, default: true },
  hub: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub' },
});

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
