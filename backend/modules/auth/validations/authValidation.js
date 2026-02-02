const { body } = require("express-validator");
const { BodyWithLocale } = require("kernels/rules");
const db = require("models");
const UserStatus = require("enums/UserStatus");
const stringUtils = require("utils/stringUtils");

module.exports = {
  login: [
    [
      new BodyWithLocale("email")
        .notEmpty()
        .isEmail(),
      new BodyWithLocale("password")
        .notEmpty()
        .isLength({ min: 6 }),
    ],
  ],

  register: [
    [
      new BodyWithLocale("name")
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 255 }),
      new BodyWithLocale("email")
        .notEmpty()
        .isEmail()
        .unique(db.User, "email"),
      new BodyWithLocale("password")
        .notEmpty()
        .isLength({ min: 6, max: 255 }),
    ],
  ],

  refreshToken: [
    [
      new BodyWithLocale("refreshToken")
        .notEmpty()
        .isString(),
    ],
  ],

  updateProfile: [
    [
      {
        get: () =>
          body("name")
            .optional()
            .isString()
            .withMessage(stringUtils.capitalize("name") + " must be text")
            .bail()
            .isLength({ min: 2, max: 255 })
            .withMessage(stringUtils.capitalize("name") + " must be between 2 and 255 characters")
            .bail(),
      },
      {
        get: () =>
          body("email")
            .optional()
            .isEmail()
            .withMessage(stringUtils.capitalize("email") + " is not in correct format")
            .bail()
            .custom(async (value, { req }) => {
              if (!value) return true;
              const existing = await db.User.findOne({
                where: { email: value.toLowerCase() },
              });
              if (existing && existing.id !== req.user?.userId) {
                throw new Error(stringUtils.capitalize("email") + " already exists");
              }
              return true;
            })
            .bail(),
      },
    ],
  ],
};
