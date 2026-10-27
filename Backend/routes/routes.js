import express, { Router } from "express";
import mongoose from "mongoose";
import User from "../models/users.js";
import Exercise from "../models/exercises.js";
import Routine from "../models/routines.js";
import { getAuth } from "@clerk/express";
import CompletedWorkout from "../models/completedWorkouts.js";



const router = express.Router();


router.get("/exercises", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/exercises", async (req, res) => {
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
})

router.get("/HomePage", async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (isAuthenticated) {
    const name = await User.findOne({ clerk_id: userId }).select("name");
    const image_url = await User.findOne({ clerk_id: userId }).select("image_url");
    res.json({ name, image_url });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }

})

router.get("/routines", async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const routines = await Routine.find({ clerk_id: userId }).sort({ createdAt: -1 });
  res.json(routines);
})

router.post("/routines", async (req, res) => {
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
})

router.get("/routines/:id", async (req, res) => {
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

})

router.patch("/routines/:id", async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.body.name !== undefined) {
    routine.name = req.body.name;
  }

  if (req.body.exercises !== undefined) {
    routine.exercises = req.body.exercises;
  }

  await routine.save();
  res.json(routine);



})




export default router;