import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

// app.js ka kaam: Express app banana aur uski settings (middlewares) lagana
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL })); // sirf apne frontend ko allow
app.use(express.json()); // req.body me JSON padhne ke liye

app.use("/api", routes);

// Ye do hamesha sabse last me
app.use(notFound);
app.use(errorHandler);

export default app;
