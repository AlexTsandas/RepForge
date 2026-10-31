import { clerkMiddleware} from '@clerk/express'
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/routes.js";
import cors from "cors";
import path from "path";

dotenv.config();
const __dirname = path.resolve();
const app = express();
if (process.env.NODE_ENV !== "production") {
app.use(cors({ origin: "http://localhost:5173", })); // Allow requests from the frontend
}
app.use(clerkMiddleware());
await connectDB();
app.use(express.json());
app.use(router);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
  });
}
const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});