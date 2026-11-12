import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    requests: { type: [Date], default: [] },
  },
  { versionKey: false }
);

const AIUsage = mongoose.model("AIUsage", aiUsageSchema);

export default AIUsage;