import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log("Failed",err);
});

app.listen(3000, () => {
  console.log("server is running on port 3000 !!!");
});
