import { v2 as cloudinary } from "cloudinary";

const keys = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];

export const isCloudinaryConfigured = () => keys.every((key) => process.env[key]);

export const connectCloudinary = async () => {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(`⚠️  Cloudinary not configured. Missing env: ${missing.join(", ")} (image upload will not work)`);
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary connected");
    return true;
  } catch (error) {
    console.error(`❌ Cloudinary connection failed: ${error.error?.message || error.message}`);
    return false;
  }
};

export default cloudinary;
