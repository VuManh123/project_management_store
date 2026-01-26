const jwt = require("jsonwebtoken");
const { config } = require("configs");
const responseUtils = require("utils/responseUtils");

const authenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseUtils.unauthorized(res, "No token provided");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return responseUtils.unauthorized(res, "Token expired");
    }
    if (error.name === "JsonWebTokenError") {
      return responseUtils.unauthorized(res, "Invalid token");
    }
    return responseUtils.unauthorized(res, "Authentication failed");
  }
};

module.exports = authenticated;
