import User from "../models/users.js";
import Exercise from "../models/exercises.js";
import Routine from "../models/routines.js";
import { getAuth } from "@clerk/express";
import CompletedWorkout from "../models/completedWorkouts.js";


export async function createExercise(req, res) {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { name, equipment } = req.body;
    const newExercise = new Exercise({ name, equipment });
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllExercises(req, res) {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getInfoDashboard(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const name = await User.findOne({ clerk_id: userId }).select("name");
  const image_url = await User.findOne({ clerk_id: userId }).select("image_url");
  const recentWorkouts = await CompletedWorkout.find({ clerk_id: userId }).sort({ completedAt: -1 }).limit(3);
  const workoutsCompleted = await CompletedWorkout.find({ clerk_id: userId }).sort({ completedAt: -1 });

  res.json({ name, image_url, recentWorkouts, workoutsCompleted });
}

export async function getMyRoutines(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const routines = await Routine.find({ clerk_id: userId }).sort({ createdAt: -1 });
  res.json(routines);
}

export async function createRoutines(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const newRoutine = new Routine({
    name: req.body.name,
    exercises: req.body.exercises,
    clerk_id: userId
  });
  await newRoutine.save();
  res.status(201).json(newRoutine);
}

export async function getRoutineById(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const routine = await Routine.findOne({
    _id: req.params.id,
    clerk_id: userId
  });

  if (!routine) {
    return res.status(404).json({ error: "Routine not found" });
  }

  res.json(routine);

}

export async function updateRoutine(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const routine = await Routine.findOne({
    _id: req.params.id,
    clerk_id: userId
  });

  if (!routine) {
    return res.status(404).json({ error: "Routine not found" });
  }
  if (req.body.name !== undefined) {
    routine.name = req.body.name;
  }

  if (req.body.exercises !== undefined) {
    routine.exercises = req.body.exercises;
  }

  await routine.save();
  res.json(routine);
}

export async function deleteRoutine(req, res){
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const result = await Routine.deleteOne({
    _id: req.params.id,
    clerk_id: userId
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Routine not found" });
  }
  res.status(200).json({ message: "Routine deleted" });
} 

export async function getWorkoutHistory(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const completedWorkouts = await CompletedWorkout.find({ clerk_id: userId }).sort({ completedAt: -1 });
  res.json(completedWorkouts);
}

export async function createActiveWorkout(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const newWorkoutCompleted = new CompletedWorkout({
    name: req.body.name,
    exercises: req.body.exercises,
    clerk_id: userId,
    routineId: req.body.routineId
  });

  await newWorkoutCompleted.save();
  res.status(201).json(newWorkoutCompleted);
}




