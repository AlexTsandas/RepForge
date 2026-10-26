import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    clerk_id: { type: String, required: true, unique: true },
    image_url: { type: String, required: false },
  });

const User = mongoose.model("User", usersSchema);

export default User;  
