import multer from "multer";

// The file stays in memory (never saved on disk) and is then sent to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    const error = new Error("Only image files are allowed");
    error.status = 400;
    cb(error);
  },
});

export default upload.single("image");
