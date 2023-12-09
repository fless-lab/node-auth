const { body, validationResult } = require("express-validator");

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 2 })
    .withMessage("Password must have at least 2 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = {};
      errors.array().forEach((error) => {
        formattedErrors[error.path] = error.msg;
      });
      return res.status(400).json({ success: false, errors: formattedErrors });
    }
    next();
  },
];

module.exports = validateLogin;
