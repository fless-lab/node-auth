const { body, validationResult } = require("express-validator");

const validateAccountVerification = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("code").notEmpty().withMessage("Code is required"),
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

module.exports = validateAccountVerification;
