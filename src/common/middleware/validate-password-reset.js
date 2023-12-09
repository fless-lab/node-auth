const { body, validationResult } = require("express-validator");

const validatePasswordReset = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("code").notEmpty().withMessage("Code is required"),
  body("password").isLength({min:2}).withMessage("Password must have at least 2 characters"),
  body("passwordConfirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),

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

module.exports = validatePasswordReset;