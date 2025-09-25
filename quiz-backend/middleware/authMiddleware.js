// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Extract JWT token from Authorization header (Bearer scheme).
 */
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

/**
 * Middleware: Require authentication (valid JWT + existing user).
 */
const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password"); // don’t attach password
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Middleware: Optional authentication (attach user if token is valid).
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select("-password");
      if (user) req.user = user;
    }
  } catch {
    // Ignore invalid/expired token
  } finally {
    next();
  }
};

/**
 * Middleware: Require admin role.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};

module.exports = { requireAuth, optionalAuth, requireAdmin };
