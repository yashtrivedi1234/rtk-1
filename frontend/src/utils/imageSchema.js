import * as yup from "yup";

// Image rules. Keep them the same as backend/src/middlewares/upload.middleware.js
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;
const MIN_SIZE = 200; // pixels (width and height)
const RATIO_TOLERANCE = 0.02; // the image must be square (1:1), with 2% tolerance

export const IMAGE_HINT = `Square image (1:1), at least ${MIN_SIZE}×${MIN_SIZE}px. JPG, PNG or WebP, max 2MB.`;

// Reads the real pixel size of the chosen file
const getImageSize = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("invalid image"));
    };
    img.src = url;
  });

// Yup rules for an <input type="file">. Pass a message to make the image required.
export const imageSchema = (requiredMessage) =>
  yup
    .mixed()
    .test("required", requiredMessage, (files) => !requiredMessage || files?.length > 0)
    .test("type", "Only JPG, PNG or WebP images are allowed", (files) => !files?.[0] || IMAGE_TYPES.includes(files[0].type))
    .test("size", "Image must be smaller than 2MB", (files) => !files?.[0] || files[0].size <= MAX_BYTES)
    .test("shape", "Image must be square", async function (files) {
      const file = files?.[0];
      if (!file || !IMAGE_TYPES.includes(file.type)) return true; // the type rule reports this

      let size;
      try {
        size = await getImageSize(file);
      } catch {
        return this.createError({ message: "This file is not a valid image" });
      }

      const { width, height } = size;
      if (width < MIN_SIZE || height < MIN_SIZE) {
        return this.createError({ message: `Image must be at least ${MIN_SIZE}×${MIN_SIZE} pixels (yours is ${width}×${height})` });
      }
      if (Math.abs(width / height - 1) > RATIO_TOLERANCE) {
        return this.createError({ message: `Image must be square (1:1). Yours is ${width}×${height}` });
      }
      return true;
    });
