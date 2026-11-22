import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

// The file is never saved on disk: the in-memory buffer is streamed straight to Cloudinary
export const uploadImage = (buffer) => {
  if (!isCloudinaryConfigured()) {
    const error = new Error("Image upload is unavailable (Cloudinary is not configured)");
    error.status = 503;
    throw error;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "students" }, (error, result) =>
        error ? reject(error) : resolve({ url: result.secure_url, publicId: result.public_id })
      )
      .end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) return;
  await cloudinary.uploader.destroy(publicId);
};
