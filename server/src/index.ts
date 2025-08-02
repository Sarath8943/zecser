import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Configuration
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));

// ✅ Middleware
app.use(express.json());          
app.use(cookieParser());           

// ✅ Routes
app.use("/api/user", userRoutes);
app.use("/api/otp",userRoutes );

// ✅ Base Route
app.get("/", (_req, res) => {
  res.send("API is running...");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
