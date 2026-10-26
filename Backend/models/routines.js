import mongoose from "mongoose";

const routinesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    clerk_id: { type: String, required: true },
    exercises: {
      type: [
        {
          exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            required: true
          },
          sets: {
            type: Number,
            required: true,
            min: 1,
            validate: {
              validator: Number.isInteger,
              message: "Sets must be a whole number."
            }
          }
        }
      ],
      required: true,
      validate: {
        validator: (exercises) => exercises.length > 0,
        message: "A routine must contain at least one exercise."
      }
    }
  },
  { timestamps: true }
);

const Routine = mongoose.model("Routine", routinesSchema);

export default Routine;