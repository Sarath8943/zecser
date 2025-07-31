
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
;

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


connectDB();



//  app.use("/api/users", userRoutes );
app.use("/api/user", userRoutes );


app.get("/", (_req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
