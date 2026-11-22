export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// Every error ends up here and the client always gets the same shape: { message }
export const errorHandler = (err, req, res, next) => {
  let status = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue).find((key) => key !== "user");
    status = 409;
    message = `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists`;
  } else if (err.name === "MulterError") {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 2MB" : err.message;
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid id";
  }

  // Do not leak internal details in production
  if (status === 500 && process.env.NODE_ENV === "production") message = "Server error";

  res.status(status).json({ message });
};
