require("express-router-group");
const express = require("express");
const middlewares = require("kernels/middlewares");
const { validate } = require("kernels/validations");
const authenticated = require("kernels/middlewares/authenticated");
const exampleController = require("modules/examples/controllers/exampleController");
const authController = require("modules/auth/controllers/authController");
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
  router.post("/login", authController.login);
  router.post("/register", authController.register);
  router.post("/logout", authController.logout);
  router.post("/refresh", authController.refreshToken);
});

// Protected auth routes
router.group("/auth", middlewares([authenticated]), (router) => {
  router.get("/profile", authController.getProfile);
});

// Example routes
router.group("/example", validate([]), (router) => {
  router.get('/', exampleController.exampleRequest)
})

module.exports = router;
