import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token from cookies and attaches user to request
 */
const protectedRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Invalid token.",
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
      error: error.message,
    });
  }
};

export default protectedRoute;
