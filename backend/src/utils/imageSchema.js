import * as yup from "yup";
import { imageSize } from "image-size";

// Image rules. Keep them the same as frontend/src/utils/imageSchema.js
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MIN_SIZE = 200; // pixels (width and height)
const RATIO_TOLERANCE = 0.02; // the image must be square (1:1), with 2% tolerance

// Yup rules for the uploaded file (req.file). Pass a message to make the image required.
// The 2MB size limit is enforced by multer while the file is being received.
export const imageSchema = (requiredMessage) =>
  yup
    .mixed()
    .test("required", requiredMessage, (file) => !requiredMessage || !!file)
    .test("type", "Only JPG, PNG or WebP images are allowed", (file) => !file || ALLOWED_TYPES.includes(file.mimetype))
    .test("shape", "Image must be square", function (file) {
      if (!file || !ALLOWED_TYPES.includes(file.mimetype)) return true; // the type rule reports this

      // The size is read from the file itself, so a renamed or fake file cannot pass
      let width, height;
      try {
        ({ width, height } = imageSize(file.buffer));
      } catch {
        return this.createError({ message: "The file is not a valid image" });
      }

      if (width < MIN_SIZE || height < MIN_SIZE) {
        return this.createError({ message: `Image must be at least ${MIN_SIZE}×${MIN_SIZE} pixels (yours is ${width}×${height})` });
      }
      if (Math.abs(width / height - 1) > RATIO_TOLERANCE) {
        return this.createError({ message: `Image must be square (1:1). Yours is ${width}×${height}` });
      }
      return true;
    });
