import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

// sirf .env wale CLIENT_URL (frontend) ko allow karta hai
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json()); // req.body me JSON padhne ke liye

app.use("/api/students", studentRoutes);

await connectDB();
app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
