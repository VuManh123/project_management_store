const { BodyWithLocale } = require("kernels/rules");
const db = require("models");
const UserStatus = require("enums/UserStatus");

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
};
