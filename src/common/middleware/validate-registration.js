const { body, validationResult } = require("express-validator");
const fs = require('fs');

const validateRegistration = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 2 })
    .withMessage("Password must have at least 2 characters"),
  body("avatar").custom((value, { req }) => {
    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxFileSize = 1024 * 1024; //1Mo

      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error(
          "The provided avatar must be an image (jpeg, png, gif)"
        );
      }
      if (req.file.size > maxFileSize) {
        throw new Error("The avatar size cannot be greater than 1Mo");
      }
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const avatarError = errors
        .array()
        .find((error) => error.path === "avatar");
      if (avatarError) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, () => {});
        }
      }
      const formattedErrors = {};
      errors.array().forEach((error) => {
        formattedErrors[error.path] = error.msg;
      });
      return res.status(400).json({ success: false, errors: formattedErrors });
    }
    next();
  },
];

module.exports = validateRegistration;
