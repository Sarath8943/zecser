import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["employee", "employer", "admin", "superadmin"],
    default: "employee",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
