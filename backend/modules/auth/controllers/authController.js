const responseUtils = require("utils/responseUtils");
const jwtUtils = require("utils/jwtUtils");
const bcrypt = require("bcryptjs");
const { config } = require("configs");
const db = require("models");
const UserStatus = require("enums/UserStatus");
const ProjectMemberRole = require("enums/ProjectMemberRole");
const cloudinaryUtils = require("utils/cloudinaryUtils");

const authController = {
  // Login with email and password
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await db.User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return responseUtils.unauthorized(res, "Invalid email or password");
      }

      // Check if user is blocked
      if (user.status === UserStatus.BLOCKED) {
        return responseUtils.unauthorized(res, "Account is blocked");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return responseUtils.unauthorized(res, "Invalid email or password");
      }

      // Determine user role (check if user is PM of any project, or has LEADER role in any project)
      // For simplicity, we'll use a default role. In a real app, you might want to check project memberships
      let userRole = "MEMBER";
      
      // Check if user is PM of any project
      const pmProject = await db.Project.findOne({
        where: { pm_id: user.id },
      });
      if (pmProject) {
        userRole = "PM";
      } else {
        // Check if user is LEADER in any project
        const leaderMembership = await db.ProjectMember.findOne({
          where: {
            user_id: user.id,
            role: ProjectMemberRole.LEADER,
          },
        });
        if (leaderMembership) {
          userRole = "LEADER";
        }
      }

      // Generate tokens
      const token = jwtUtils.sign(user.id, userRole);
      const refreshToken = jwtUtils.signRefreshToken(user.id, userRole);

      // Return user data (exclude password)
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.created_at,
      };

      return responseUtils.ok(res, {
        user: userData,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      return responseUtils.error(res, "Login failed");
    }
  },

  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(
        password,
        config.hashing.bcrypt.rounds
      );

      // Create user
      const user = await db.User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      });

      // Generate tokens (default role is MEMBER for new users)
      const token = jwtUtils.sign(user.id, "MEMBER");
      const refreshToken = jwtUtils.signRefreshToken(user.id, "MEMBER");

      // Return user data (exclude password)
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.created_at,
      };

      return responseUtils.ok(res, {
        user: userData,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Register error:", error);
      
      // Handle duplicate email error
      if (error.name === "SequelizeUniqueConstraintError") {
        return responseUtils.invalidated(res, {
          email: "Email already exists",
        });
      }

      return responseUtils.error(res, "Registration failed");
    }
  },

  // Logout (stateless JWT - just return success)
  logout: async (req, res) => {
    try {
      // With stateless JWT, logout is handled client-side by removing the token
      // If you need server-side logout, implement a token blacklist
      return responseUtils.ok(res, {
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return responseUtils.error(res, "Logout failed");
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return responseUtils.unauthorized(res, "User not authenticated");
      }

      // Find user in database
      const user = await db.User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return responseUtils.notFound(res);
      }

      // Determine user role
      let userRole = "MEMBER";
      const pmProject = await db.Project.findOne({
        where: { pm_id: user.id },
      });
      if (pmProject) {
        userRole = "PM";
      } else {
        const leaderMembership = await db.ProjectMember.findOne({
          where: {
            user_id: user.id,
            role: ProjectMemberRole.LEADER,
          },
        });
        if (leaderMembership) {
          userRole = "LEADER";
        }
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        role: userRole,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };

      return responseUtils.ok(res, userData);
    } catch (error) {
      console.error("Get profile error:", error);
      return responseUtils.error(res, "Failed to get profile");
    }
  },

  // Update user profile (name, email, avatar via Cloudinary)
  updateProfile: async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return responseUtils.unauthorized(res, "User not authenticated");
      }

      const user = await db.User.findByPk(userId);
      if (!user) {
        return responseUtils.notFound(res);
      }

      const updateData = {};

      if (req.body.name !== undefined && req.body.name !== "") {
        updateData.name = req.body.name.trim();
      }
      if (req.body.email !== undefined && req.body.email !== "") {
        updateData.email = req.body.email.toLowerCase().trim();
      }

      // Upload avatar to Cloudinary if file is present
      if (req.file && req.file.buffer) {
        try {
          if (!config.cloudinary.cloud_name || !config.cloudinary.api_key) {
            return responseUtils.error(
              res,
              "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
            );
          }
          const folder = "avatars";
          const publicId = `user_${userId}_${Date.now()}`;
          const { url } = await cloudinaryUtils.uploadFromBuffer(
            req.file.buffer,
            folder,
            publicId
          );
          updateData.avatar = url;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return responseUtils.error(res, "Failed to upload avatar");
        }
      }

      if (Object.keys(updateData).length === 0) {
        return responseUtils.invalidated(res, {
          message: "No valid fields to update. Send name, email, or avatar.",
        });
      }

      await user.update(updateData);

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };

      return responseUtils.ok(res, userData);
    } catch (error) {
      console.error("Update profile error:", error);
      return responseUtils.error(res, "Failed to update profile");
    }
  },

  // Refresh access token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return responseUtils.invalidated(res, {
          refreshToken: "Refresh token is required",
        });
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = jwtUtils.verify(refreshToken);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return responseUtils.unauthorized(res, "Refresh token expired");
        }
        return responseUtils.unauthorized(res, "Invalid refresh token");
      }

      // Get user from database
      const user = await db.User.findByPk(decoded.userId);
      if (!user) {
        return responseUtils.unauthorized(res, "User not found");
      }

      // Check if user is blocked
      if (user.status === UserStatus.BLOCKED) {
        return responseUtils.unauthorized(res, "Account is blocked");
      }

      // Determine user role
      let userRole = "MEMBER";
      const pmProject = await db.Project.findOne({
        where: { pm_id: user.id },
      });
      if (pmProject) {
        userRole = "PM";
      } else {
        const leaderMembership = await db.ProjectMember.findOne({
          where: {
            user_id: user.id,
            role: ProjectMemberRole.LEADER,
          },
        });
        if (leaderMembership) {
          userRole = "LEADER";
        }
      }

      // Generate new access token
      const token = jwtUtils.sign(user.id, userRole);

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
