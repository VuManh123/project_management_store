require("express-router-group");
const express = require("express");
const middlewares = require("kernels/middlewares");
const { validate } = require("kernels/validations");
const authenticated = require("kernels/middlewares/authenticated");
const uploadAvatar = require("kernels/middlewares/uploadAvatar");
const exampleController = require("modules/examples/controllers/exampleController");
const authController = require("modules/auth/controllers/authController");
const authValidation = require("modules/auth/validations/authValidation");
const projectController = require("modules/projects/controllers/projectController");
const projectValidation = require("modules/projects/validations/projectValidation");
const taskController = require("modules/tasks/controllers/taskController");
const taskValidation = require("modules/tasks/validations/taskValidation");
const router = express.Router({ mergeParams: true });

// Health check endpoint (for Docker health checks)
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ===== EXAMPLE Request, make this commented =====
// router.group("/posts",middlewares([authenticated, role("owner")]),(router) => {
//   router.post("/create",validate([createPostRequest]),postsController.create);
//   router.put("/update/:postId",validate([updatePostRequest]),postsController.update);
//   router.delete("/delete/:postId", postsController.destroy);
// }
// );

// Auth routes (no authentication required)
router.group("/auth", validate([]), (router) => {
  router.post("/login", validate(authValidation.login), authController.login);
  router.post("/register", validate(authValidation.register), authController.register);
  router.post("/logout", authController.logout);
  router.post("/refresh", validate(authValidation.refreshToken), authController.refreshToken);
});

// Protected auth routes
router.group("/auth", middlewares([authenticated]), (router) => {
  router.get("/profile", authController.getProfile);
  router.put(
    "/profile",
    uploadAvatar,
    validate(authValidation.updateProfile),
    authController.updateProfile
  );
});

// Project routes (protected)
router.group("/projects", middlewares([authenticated]), (router) => {
  // CRUD operations
  router.post("/", validate(projectValidation.create), projectController.create);
  router.get("/", validate(projectValidation.getAll), projectController.getAll);
  router.get("/:projectId", validate(projectValidation.getById), projectController.getById);
  router.put("/:projectId", validate(projectValidation.update), projectController.update);
  router.delete("/:projectId", validate(projectValidation.delete), projectController.delete);

  // Member management
  router.post("/:projectId/members", validate(projectValidation.addMember), projectController.addMember);
  router.delete("/:projectId/members/:memberId", validate(projectValidation.removeMember), projectController.removeMember);
  router.put("/:projectId/members/:memberId/role", validate(projectValidation.updateMemberRole), projectController.updateMemberRole);

  // Task routes (nested under projects)
  router.post("/:projectId/tasks", validate(taskValidation.create), taskController.create);
  router.get("/:projectId/tasks", validate(taskValidation.getAll), taskController.getAll);
  router.get("/:projectId/tasks/:taskId", validate(taskValidation.getById), taskController.getById);
  router.put("/:projectId/tasks/:taskId", validate(taskValidation.update), taskController.update);
  router.delete("/:projectId/tasks/:taskId", validate(taskValidation.delete), taskController.delete);
  router.patch("/:projectId/tasks/:taskId/status", validate(taskValidation.updateStatus), taskController.updateStatus);
});

// Example routes
router.group("/example", validate([]), (router) => {
  router.get('/', exampleController.exampleRequest)
})

module.exports = router;
