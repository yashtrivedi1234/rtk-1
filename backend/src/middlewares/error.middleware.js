export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode >= 400 ? res.statusCode : 500;
  let message = err.message;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid id";
  }

  // Production me andar ki detail user ko mat dikhao
  if (status === 500 && process.env.NODE_ENV === "production") message = "Server error";

  res.status(status).json({ message });
};
