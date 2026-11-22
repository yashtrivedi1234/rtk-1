import multer from "multer";
import { imageSize } from "image-size";

// Image rules. Keep them the same as frontend/src/utils/imageSchema.js
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MIN_SIZE = 200; // pixels (width and height)
const RATIO_TOLERANCE = 0.02; // the image must be square (1:1), with 2% tolerance

const badRequest = (message) => Object.assign(new Error(message), { status: 400 });

// The file stays in memory (never saved on disk) and is then sent to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(badRequest("Only JPG, PNG or WebP images are allowed"));
  },
});

// Reads the real size from the file itself, so a renamed or fake file cannot pass
const checkImageShape = (req, res, next) => {
  if (!req.file) return next();

  let width, height;
  try {
    ({ width, height } = imageSize(req.file.buffer));
  } catch {
    return next(badRequest("The file is not a valid image"));
  }

  if (width < MIN_SIZE || height < MIN_SIZE) {
    return next(badRequest(`Image must be at least ${MIN_SIZE}×${MIN_SIZE} pixels`));
  }
  if (Math.abs(width / height - 1) > RATIO_TOLERANCE) {
    return next(badRequest(`Image must be square (1:1). Yours is ${width}×${height}`));
  }
  next();
};

export default [upload.single("image"), checkImageShape];
