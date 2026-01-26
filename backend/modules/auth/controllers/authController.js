const responseUtils = require("utils/responseUtils");
const jwtUtils = require("utils/jwtUtils");

const authController = {
  // Fake Login - accepts any email/password for testing
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return responseUtils.invalidated(res, {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        });
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fake user data - determine role from email
      const userId = `user_${Date.now()}`;
      let role = "MEMBER";
      let name = email.split("@")[0];

      if (email.includes("pm")) {
        role = "PM";
        name = "Project Manager";
      } else if (email.includes("leader")) {
        role = "LEADER";
        name = "Team Leader";
      }

      // Create fake user object
      const user = {
        id: userId,
        name: name,
        email: email,
        role: role,
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      // Generate tokens
      const token = jwtUtils.sign(userId, role);
      const refreshToken = jwtUtils.signRefreshToken(userId, role);

      // Return success response (responseUtils.ok wraps data in { success: true, data: ... })
      return responseUtils.ok(res, {
        user,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      return responseUtils.error(res, "Login failed");
    }
  },

  // Fake Register
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return responseUtils.invalidated(res, {
          name: !name ? "Name is required" : undefined,
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        });
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create fake user
      const userId = `user_${Date.now()}`;
      const role = "MEMBER"; // Default role for new users

      const user = {
        id: userId,
        name: name,
        email: email,
        role: role,
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      // Generate tokens
      const token = jwtUtils.sign(userId, role);
      const refreshToken = jwtUtils.signRefreshToken(userId, role);

      return responseUtils.ok(res, {
        user,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Register error:", error);
      return responseUtils.error(res, "Registration failed");
    }
  },

  // Fake Logout
  logout: async (req, res) => {
    try {
      // In real app, you would invalidate the token
      // For fake API, just return success
      return responseUtils.ok(res, {
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return responseUtils.error(res, "Logout failed");
    }
  },

  // Fake Get Profile
  getProfile: async (req, res) => {
    try {
      // Get user from token (authenticated middleware already decoded it)
      // For fake API, create user from token data
      const userId = req.user?.userId || "user_1";
      const role = req.user?.role || "MEMBER";
      
      // Extract email from userId if possible, or use default
      const email = userId.includes("@") ? userId : `${role.toLowerCase()}@example.com`;
      const name = role === "PM" ? "Project Manager" : 
                   role === "LEADER" ? "Team Leader" : 
                   "Test User";

      const user = {
        id: userId,
        name: name,
        email: email,
        role: role,
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      return responseUtils.ok(res, user);
    } catch (error) {
      console.error("Get profile error:", error);
      return responseUtils.error(res, "Failed to get profile");
    }
  },

  // Fake Refresh Token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return responseUtils.invalidated(res, {
          refreshToken: "Refresh token is required",
        });
      }

      // In real app, verify refresh token and generate new access token
      // For fake API, just return a new token
      const userId = `user_${Date.now()}`;
      const role = "MEMBER";
      const token = jwtUtils.sign(userId, role);

      return responseUtils.ok(res, {
        token,
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return responseUtils.unauthorized(res, "Invalid refresh token");
    }
  },
};

module.exports = authController;
