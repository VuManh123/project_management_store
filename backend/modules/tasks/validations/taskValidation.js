const { body, param, query } = require("express-validator");
const { BodyWithLocale, ParamWithLocale, QueryWithLocale } = require("kernels/rules");
const db = require("models");
const TaskStatus = require("enums/TaskStatus");
const TaskPriority = require("enums/TaskPriority");
const TaskType = require("enums/TaskType");
const stringUtils = require("utils/stringUtils");

module.exports = {
  create: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new BodyWithLocale("title")
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 255 }),
      {
        get: () =>
          body("description")
            .optional({ nullable: true })
            .isString()
            .withMessage(stringUtils.capitalize("description") + " must be text")
            .isLength({ max: 5000 })
            .withMessage(stringUtils.capitalize("description") + " must not exceed 5000 characters"),
      },
      {
        get: () =>
          body("type")
            .optional({ nullable: true })
            .isInt()
            .withMessage(stringUtils.capitalize("type") + " must be an integer")
            .isIn([TaskType.TASK, TaskType.BUG, TaskType.STORY, TaskType.EPIC])
            .withMessage(stringUtils.capitalize("type") + " must be TASK, BUG, STORY, or EPIC"),
      },
      {
        get: () =>
          body("status")
            .optional({ nullable: true })
            .isInt()
            .withMessage(stringUtils.capitalize("status") + " must be an integer")
            .isIn([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE, TaskStatus.REJECT])
            .withMessage(stringUtils.capitalize("status") + " must be TODO, IN_PROGRESS, REVIEW, DONE, or REJECT"),
      },
      {
        get: () =>
          body("priority")
            .optional({ nullable: true })
            .isInt()
            .withMessage(stringUtils.capitalize("priority") + " must be an integer")
            .isIn([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.CRITICAL])
            .withMessage(stringUtils.capitalize("priority") + " must be LOW, MEDIUM, HIGH, or CRITICAL"),
      },
      {
        get: () =>
          body("assigned_to")
            .optional({ nullable: true })
            .isUUID()
            .withMessage(stringUtils.capitalize("assigned_to") + " must be a valid UUID")
            .custom(async (value, { req }) => {
              if (value) {
                const user = await db.User.findByPk(value);
                if (!user) {
                  throw new Error("Assigned user not found");
                }
                // Verify user is a member of the project
                const projectMember = await db.ProjectMember.findOne({
                  where: {
                    project_id: req.params.projectId,
                    user_id: value,
                  },
                });
                if (!projectMember) {
                  throw new Error("Assigned user is not a member of this project");
                }
              }
              return true;
            }),
      },
      {
        get: () =>
          body("progress")
            .optional({ nullable: true })
            .isInt({ min: 0, max: 100 })
            .withMessage(stringUtils.capitalize("progress") + " must be between 0 and 100"),
      },
      {
        get: () =>
          body("estimate_hour")
            .optional({ nullable: true })
            .isInt({ min: 0 })
            .withMessage(stringUtils.capitalize("estimate_hour") + " must be a positive integer"),
      },
      {
        get: () =>
          body("due_date")
            .optional({ nullable: true })
            .isDate()
            .withMessage(stringUtils.capitalize("due_date") + " must be a valid date"),
      },
      {
        get: () =>
          body("parent_task_id")
            .optional({ nullable: true })
            .isUUID()
            .withMessage(stringUtils.capitalize("parent_task_id") + " must be a valid UUID")
            .custom(async (value, { req }) => {
              if (value) {
                const parentTask = await db.Task.findOne({
                  where: {
                    id: value,
                    project_id: req.params.projectId,
                  },
                });
                if (!parentTask) {
                  throw new Error("Parent task not found in this project");
                }
              }
              return true;
            }),
      },
    ],
  ],

  update: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new ParamWithLocale("taskId")
        .notEmpty()
        .isUUID()
        .exists(db.Task, "id"),
      {
        get: () =>
          body("title")
            .optional()
            .isString()
            .withMessage(stringUtils.capitalize("title") + " must be text")
            .isLength({ min: 2, max: 255 })
            .withMessage(stringUtils.capitalize("title") + " must be between 2 and 255 characters"),
      },
      {
        get: () =>
          body("description")
            .optional({ nullable: true })
            .isString()
            .withMessage(stringUtils.capitalize("description") + " must be text")
            .isLength({ max: 5000 })
            .withMessage(stringUtils.capitalize("description") + " must not exceed 5000 characters"),
      },
      {
        get: () =>
          body("type")
            .optional({ nullable: true })
            .isInt()
            .withMessage(stringUtils.capitalize("type") + " must be an integer")
            .isIn([TaskType.TASK, TaskType.BUG, TaskType.STORY, TaskType.EPIC])
            .withMessage(stringUtils.capitalize("type") + " must be TASK, BUG, STORY, or EPIC"),
      },
      {
        get: () =>
          body("status")
            .optional({ nullable: true })
            .isInt()
            .withMessage(stringUtils.capitalize("status") + " must be an integer")
            .isIn([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE, TaskStatus.REJECT])
            .withMessage(stringUtils.capitalize("status") + " must be TODO, IN_PROGRESS, REVIEW, DONE, or REJECT"),
      },
      {
        get: () =>
          body("priority")
            .optional({ nullable: true })
            .isInt()
            .withMessage(stringUtils.capitalize("priority") + " must be an integer")
            .isIn([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.CRITICAL])
            .withMessage(stringUtils.capitalize("priority") + " must be LOW, MEDIUM, HIGH, or CRITICAL"),
      },
      {
        get: () =>
          body("assigned_to")
            .optional({ nullable: true })
            .isUUID()
            .withMessage(stringUtils.capitalize("assigned_to") + " must be a valid UUID")
            .custom(async (value, { req }) => {
              if (value) {
                const user = await db.User.findByPk(value);
                if (!user) {
                  throw new Error("Assigned user not found");
                }
                // Verify user is a member of the project
                const projectMember = await db.ProjectMember.findOne({
                  where: {
                    project_id: req.params.projectId,
                    user_id: value,
                  },
                });
                if (!projectMember) {
                  throw new Error("Assigned user is not a member of this project");
                }
              }
              return true;
            }),
      },
      {
        get: () =>
          body("progress")
            .optional({ nullable: true })
            .isInt({ min: 0, max: 100 })
            .withMessage(stringUtils.capitalize("progress") + " must be between 0 and 100"),
      },
      {
        get: () =>
          body("estimate_hour")
            .optional({ nullable: true })
            .isInt({ min: 0 })
            .withMessage(stringUtils.capitalize("estimate_hour") + " must be a positive integer"),
      },
      {
        get: () =>
          body("due_date")
            .optional({ nullable: true })
            .isDate()
            .withMessage(stringUtils.capitalize("due_date") + " must be a valid date"),
      },
      {
        get: () =>
          body("parent_task_id")
            .optional({ nullable: true })
            .isUUID()
            .withMessage(stringUtils.capitalize("parent_task_id") + " must be a valid UUID")
            .custom(async (value, { req }) => {
              if (value) {
                // Cannot set itself as parent
                if (value === req.params.taskId) {
                  throw new Error("Task cannot be its own parent");
                }
                const parentTask = await db.Task.findOne({
                  where: {
                    id: value,
                    project_id: req.params.projectId,
                  },
                });
                if (!parentTask) {
                  throw new Error("Parent task not found in this project");
                }
              }
              return true;
            }),
      },
    ],
  ],

  getById: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new ParamWithLocale("taskId")
        .notEmpty()
        .isUUID()
        .exists(db.Task, "id"),
    ],
  ],

  delete: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new ParamWithLocale("taskId")
        .notEmpty()
        .isUUID()
        .exists(db.Task, "id"),
    ],
  ],

  getAll: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      {
        get: () =>
          query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage(stringUtils.capitalize("page") + " must be a positive integer"),
      },
      {
        get: () =>
          query("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage(stringUtils.capitalize("limit") + " must be between 1 and 100"),
      },
      {
        get: () =>
          query("status")
            .optional()
            .isInt()
            .withMessage(stringUtils.capitalize("status") + " must be an integer")
            .isIn([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE, TaskStatus.REJECT])
            .withMessage(stringUtils.capitalize("status") + " must be TODO, IN_PROGRESS, REVIEW, DONE, or REJECT"),
      },
      {
        get: () =>
          query("priority")
            .optional()
            .isInt()
            .withMessage(stringUtils.capitalize("priority") + " must be an integer")
            .isIn([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.CRITICAL])
            .withMessage(stringUtils.capitalize("priority") + " must be LOW, MEDIUM, HIGH, or CRITICAL"),
      },
      {
        get: () =>
          query("type")
            .optional()
            .isInt()
            .withMessage(stringUtils.capitalize("type") + " must be an integer")
            .isIn([TaskType.TASK, TaskType.BUG, TaskType.STORY, TaskType.EPIC])
            .withMessage(stringUtils.capitalize("type") + " must be TASK, BUG, STORY, or EPIC"),
      },
      {
        get: () =>
          query("assigned_to")
            .optional()
            .isUUID()
            .withMessage(stringUtils.capitalize("assigned_to") + " must be a valid UUID"),
      },
      {
        get: () =>
          query("search")
            .optional()
            .isString()
            .withMessage(stringUtils.capitalize("search") + " must be text"),
      },
    ],
  ],

  updateStatus: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new ParamWithLocale("taskId")
        .notEmpty()
        .isUUID()
        .exists(db.Task, "id"),
      new BodyWithLocale("status")
        .notEmpty()
        .isInt()
        .isIn([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE, TaskStatus.REJECT]),
    ],
  ],
};
