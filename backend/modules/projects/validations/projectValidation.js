const { body, param, query } = require("express-validator");
const { BodyWithLocale, ParamWithLocale, QueryWithLocale } = require("kernels/rules");
const db = require("models");
const ProjectStatus = require("enums/ProjectStatus");
const ProjectMemberRole = require("enums/ProjectMemberRole");
const stringUtils = require("utils/stringUtils");

module.exports = {
  create: [
    [
      new BodyWithLocale("name")
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 255 }),
      {
        get: () =>
          body("description")
            .optional()
            .isString()
            .withMessage(stringUtils.capitalize("description") + " must be text")
            .isLength({ max: 5000 })
            .withMessage(stringUtils.capitalize("description") + " must not exceed 5000 characters"),
      },
      {
        get: () =>
          body("status")
            .optional()
            .isInt()
            .withMessage(stringUtils.capitalize("status") + " must be an integer")
            .isIn([ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED])
            .withMessage(stringUtils.capitalize("status") + " must be ACTIVE or ARCHIVED"),
      },
      {
        get: () =>
          body("start_date")
            .optional()
            .isDate()
            .withMessage(stringUtils.capitalize("start_date") + " must be a valid date"),
      },
      {
        get: () =>
          body("end_date")
            .optional()
            .isDate()
            .withMessage(stringUtils.capitalize("end_date") + " must be a valid date")
            .custom((value, { req }) => {
              if (req.body.start_date && value) {
                const startDate = new Date(req.body.start_date);
                const endDate = new Date(value);
                if (endDate < startDate) {
                  throw new Error(stringUtils.capitalize("end_date") + " must be after start_date");
                }
              }
              return true;
            }),
      },
      {
        get: () =>
          body("member_ids")
            .optional()
            .isArray()
            .withMessage(stringUtils.capitalize("member_ids") + " must be an array")
            .custom(async (value) => {
              if (value && Array.isArray(value)) {
                for (const userId of value) {
                  const user = await db.User.findByPk(userId);
                  if (!user) {
                    throw new Error(`User with ID ${userId} not found`);
                  }
                }
              }
              return true;
            }),
      },
      {
        get: () =>
          body("member_emails")
            .optional()
            .isArray()
            .withMessage(stringUtils.capitalize("member_emails") + " must be an array")
            .custom(async (value) => {
              if (value && Array.isArray(value)) {
                for (const email of value) {
                  // Validate email format
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    throw new Error(`Invalid email format: ${email}`);
                  }
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
      {
        get: () =>
          body("name")
            .optional()
            .isString()
            .withMessage(stringUtils.capitalize("name") + " must be text")
            .isLength({ min: 2, max: 255 })
            .withMessage(stringUtils.capitalize("name") + " must be between 2 and 255 characters"),
      },
      {
        get: () =>
          body("description")
            .optional()
            .isString()
            .withMessage(stringUtils.capitalize("description") + " must be text")
            .isLength({ max: 5000 })
            .withMessage(stringUtils.capitalize("description") + " must not exceed 5000 characters"),
      },
      {
        get: () =>
          body("status")
            .optional()
            .isInt()
            .withMessage(stringUtils.capitalize("status") + " must be an integer")
            .isIn([ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED])
            .withMessage(stringUtils.capitalize("status") + " must be ACTIVE or ARCHIVED"),
      },
      {
        get: () =>
          body("start_date")
            .optional()
            .isDate()
            .withMessage(stringUtils.capitalize("start_date") + " must be a valid date"),
      },
      {
        get: () =>
          body("end_date")
            .optional()
            .isDate()
            .withMessage(stringUtils.capitalize("end_date") + " must be a valid date")
            .custom((value, { req }) => {
              if (req.body.start_date && value) {
                const startDate = new Date(req.body.start_date);
                const endDate = new Date(value);
                if (endDate < startDate) {
                  throw new Error(stringUtils.capitalize("end_date") + " must be after start_date");
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
    ],
  ],

  delete: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
    ],
  ],

  getAll: [
    [
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
            .isIn([ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED])
            .withMessage(stringUtils.capitalize("status") + " must be ACTIVE or ARCHIVED"),
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

  addMember: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new BodyWithLocale("user_id")
        .notEmpty()
        .isUUID()
        .exists(db.User, "id"),
      {
        get: () =>
          body("role")
            .optional()
            .isInt()
            .withMessage(stringUtils.capitalize("role") + " must be an integer")
            .isIn([ProjectMemberRole.MEMBER, ProjectMemberRole.LEADER])
            .withMessage(stringUtils.capitalize("role") + " must be MEMBER or LEADER"),
      },
    ],
  ],

  removeMember: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new ParamWithLocale("memberId")
        .notEmpty()
        .isUUID()
        .exists(db.User, "id"),
    ],
  ],

  updateMemberRole: [
    [
      new ParamWithLocale("projectId")
        .notEmpty()
        .isUUID()
        .exists(db.Project, "id"),
      new ParamWithLocale("memberId")
        .notEmpty()
        .isUUID()
        .exists(db.User, "id"),
      new BodyWithLocale("role")
        .notEmpty()
        .isInt()
        .isIn([ProjectMemberRole.MEMBER, ProjectMemberRole.LEADER]),
    ],
  ],
};
