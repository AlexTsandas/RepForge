import { clerkMiddleware} from '@clerk/express'
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/routes.js";

dotenv.config();
const app = express();
app.use(clerkMiddleware());
const PORT = process.env.PORT || 5000;
await connectDB();
app.use(express.json());
app.use(router);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});