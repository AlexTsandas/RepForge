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
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ error: "Exercise name already exists" });
    }
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

  try {
    const user = await User.findOne({ clerk_id: userId })
      .select("name image_url");
    const recentWorkouts = await CompletedWorkout.find({ clerk_id: userId }).sort({ completedAt: -1 }).limit(3);
    const workoutsCompleted = await CompletedWorkout.find({ clerk_id: userId }).sort({ completedAt: -1 });
    res.status(200).json({
      name: user?.name ?? null,
      image_url: user?.image_url ?? null,
      recentWorkouts,
      workoutsCompleted
    });
  } catch (error) {
    console.error("Error fetching dashboard info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMyRoutines(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const routines = await Routine.find({ clerk_id: userId }).sort({ createdAt: -1 });
    res.status(200).json(routines);

  } catch (error) {
    console.error("Error fetching my routines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function createRoutines(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const check = await Routine.countDocuments({ clerk_id: userId })
    if (check >= 10) {
      return res.status(400).json({ error: "You have reached the maximum number of routines (10)." });
    }
    const exerciseIds = req.body.exercises.map(exercise => exercise.exerciseId);
    const uniqueIds = [...new Set(exerciseIds)];

    const foundCount = await Exercise.countDocuments({
      _id: { $in: uniqueIds }
    });

    if (foundCount !== uniqueIds.length) {
      return res.status(400).json({
        error: "One or more exercises do not exist."
      });
    }
    const newRoutine = new Routine({
      name: req.body.name,
      exercises: req.body.exercises,
      clerk_id: userId
    });
    await newRoutine.save();
    res.status(201).json(newRoutine);


  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating routine:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRoutineById(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const routine = await Routine.findOne({
      _id: req.params.id,
      clerk_id: userId
    });

    if (!routine) {
      return res.status(404).json({ error: "Routine not found" });
    }
    res.status(200).json(routine);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid routine ID" });
    }
    console.error("Error fetching routine by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateRoutine(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
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
      if (
        !Array.isArray(req.body.exercises) ||
        req.body.exercises.some(exercise =>
          exercise === null || typeof exercise !== "object"
        )
      ) {
        return res.status(400).json({ error: "Invalid exercises list" });
      }
      const exerciseIds = req.body.exercises.map(exercise => exercise.exerciseId);
      const uniqueIds = [...new Set(exerciseIds)];

      const foundCount = await Exercise.countDocuments({
        _id: { $in: uniqueIds }
      });

      if (foundCount !== uniqueIds.length) {
        return res.status(400).json({
          error: "One or more exercises do not exist."
        });
      } else {
        routine.exercises = req.body.exercises;
      }
    }
    await routine.save();
    res.json(routine);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid routine or exercise ID" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error updating routine:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteRoutine(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await Routine.deleteOne({
      _id: req.params.id,
      clerk_id: userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Routine not found" });
    }
    res.status(200).json({ message: "Routine deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid routine ID" });
    }
    console.error("Error deleting routine:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function getWorkoutHistory(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const completedWorkouts = await CompletedWorkout.find({ clerk_id: userId }).sort({ completedAt: -1 });
    res.json(completedWorkouts);
  } catch (error) {
    console.error("Error fetching workout history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createActiveWorkout(req, res) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    if (
      !Array.isArray(req.body.exercises) ||
      req.body.exercises.some(exercise =>
        exercise === null || typeof exercise !== "object"
      )
    ) {
      return res.status(400).json({ error: "Invalid exercises list" });
    }
    const exerciseIds = req.body.exercises.map(exercise => exercise.exerciseId);
    const uniqueIds = [...new Set(exerciseIds)];

    const foundCount = await Exercise.countDocuments({
      _id: { $in: uniqueIds }
    });

    if (foundCount !== uniqueIds.length) {
      return res.status(400).json({
        error: "One or more exercises do not exist."
      });
    }
    if (req.body.routineId !== undefined) {
      const routine = await Routine.findOne({
        _id: req.body.routineId,
        clerk_id: userId
      });

      if (!routine) {
        return res.status(404).json({ error: "Routine not found" });
      }
    }
    const newWorkoutCompleted = new CompletedWorkout({
      name: req.body.name,
      exercises: req.body.exercises,
      clerk_id: userId,
      routineId: req.body.routineId
    });
    await newWorkoutCompleted.save();
    res.status(201).json(newWorkoutCompleted);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid routine or exercise ID" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating completed workout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
