import multer from "multer";

// The file stays in memory (never saved on disk) and is then sent to Cloudinary.
// multer only receives the file (and stops anything over 2MB). The image rules live in utils/imageSchema.js.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

export default upload.single("image");
