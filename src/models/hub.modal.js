// models/Hub.js
import mongoose from "mongoose";

const HubSchema = new mongoose.Schema({
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  slug: { type: String, unique: true }, // <- New slug field
  description: { type: String },
  aiContent: {
    type: mongoose.Schema.Types.Mixed, // Stores the full JSON structure from AI
  },
  isForked: { type: Boolean, default: false },
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hub",
    default: null,
  },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  progressTrackers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Progress" }],
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Hub || mongoose.model("Hub", HubSchema);
