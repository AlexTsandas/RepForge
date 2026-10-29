import express from "express";
import {
  createExercise, getAllExercises, getInfoDashboard, getMyRoutines,
  createRoutines, getRoutineById, updateRoutine,
  deleteRoutine, getWorkoutHistory, createActiveWorkout
} from "../controllers/controller.js";

const router = express.Router();

router.get("/exercises", getAllExercises);

router.post("/exercises", createExercise);

router.get("/dashboard", getInfoDashboard);

router.get("/myroutines", getMyRoutines);

router.post("/myroutines", createRoutines);

router.get("/myroutines/:id", getRoutineById);

router.patch("/myroutines/:id", updateRoutine);

router.delete("/myroutines/:id", deleteRoutine);

router.get("/workoutshistory", getWorkoutHistory);

router.post("/activeworkout", createActiveWorkout);

export default router;