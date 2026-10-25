import { clerkMiddleware, clerkClient, getAuth } from '@clerk/express'
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
app.use(clerkMiddleware());
const PORT = process.env.PORT || 5000;
await connectDB();

app.get("/HomePage", async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req)

  if (!isAuthenticated) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  // Use the `getUser()` method to get the user's User object
  const user = await clerkClient.users.getUser(userId)

  res.json({ user })
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});