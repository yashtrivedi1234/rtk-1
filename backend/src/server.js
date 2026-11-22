import "dotenv/config"; // sabse pehle .env load hona chahiye
import app from "./app.js";
import connectDB from "./config/db.js";

await connectDB();
app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
