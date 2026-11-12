import mongoose from "mongoose";

const dashboardAISchema = new mongoose.Schema({
  clerk_id: {
    type: String,
    required: true,
    unique: true,
  },
  workoutCount: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "Workout count must be a whole number.",
    },
  },
  generatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  highlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    default: null,
  },
});

const DashboardAI = mongoose.model("DashboardAI", dashboardAISchema);

export default DashboardAI;