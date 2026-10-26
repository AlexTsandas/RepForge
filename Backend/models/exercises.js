 import mongoose from "mongoose";
 
 const exercisesSchema = new mongoose.Schema(
   {
     name: { type: String, required: true, unique: true },
     equipment: { type: String, required: true },
   });
 
 const Exercise = mongoose.model("Exercise", exercisesSchema);
 
 export default Exercise;  