import { clerkMiddleware} from '@clerk/express'
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/routes.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

dotenv.config();
const app = express();
if (process.env.VERCEL) {
  app.set("trust proxy", 1);
}
if (process.env.NODE_ENV !== "production") {
app.use(cors({ origin: "http://localhost:5173", })); // Allow requests from the frontend
}
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again shortly.",
  },
});

app.use("/api", apiLimiter);

app.use(clerkMiddleware());
await connectDB();
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});