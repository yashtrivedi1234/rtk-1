import "dotenv/config"; // must be first: it loads the .env file
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { connectMailer } from "./config/mailer.js";

// The server cannot run without these, so stop right away with a clear message
const missing = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"].filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

await connectDB();
await connectCloudinary();
await connectMailer();

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
