import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();
const app = express();
app.use(express.json());
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("Failed", err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use((err, req,res,next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "Internal server error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  })
})

app.listen(3000, () => {
  console.log("server is running on port 3000 !!!");
});
