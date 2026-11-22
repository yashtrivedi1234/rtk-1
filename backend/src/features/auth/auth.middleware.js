import jwt from "jsonwebtoken";
import User from "./user.model.js";

// Runs before every protected route. Expects the header: Authorization: Bearer <token>
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  let user = null;
  if (token) {
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(id);
    } catch {
      user = null;
    }
  }

  if (!user) {
    res.status(401);
    throw new Error("Please log in to continue");
  }

  req.user = user;
  next();
};
