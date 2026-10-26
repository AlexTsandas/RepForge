import mongoose from "mongoose";

const completedWorkoutsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    clerk_id: { type: String, required: true },

    // Present when started from a routine; otherwise omitted.
    routineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Routine"
    },

    exercises: {
      type: [
        {
          exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            required: true
          },

          // Preserve the name shown during this workout.
          name: { type: String, required: true },

          sets: {
            type: [
              {
                weight: {
                  type: Number,
                  required: true,
                  min: 0
                },
                reps: {
                  type: Number,
                  required: true,
                  min: 0,
                  validate: Number.isInteger
                }
              }
            ],
            required: true,
            validate: {
              validator: (setList) => setList.length > 0,
              message: "Each exercise must contain at least one set."
            }
          }
        }
      ],
      required: true,
      validate: {
        validator: (exerciseList) => exerciseList.length > 0,
        message: "A completed workout must contain at least one exercise."
      }
    },

    completedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { timestamps: true }
);

const CompletedWorkout = mongoose.model(
  "CompletedWorkout",
  completedWorkoutsSchema,
  "workouts_completed"
);

export default CompletedWorkout;