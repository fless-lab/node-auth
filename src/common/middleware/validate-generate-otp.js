const { body, validationResult } = require("express-validator");
const { OTP_PURPOSE } = require("../../../constants");

const validPurposes = Object.values(OTP_PURPOSE);

const validateGenerateOTP = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("purpose").notEmpty().custom((value) => {
    if (!validPurposes.includes(value)) {
      throw new Error("Invalid purpose");
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

module.exports = validateGenerateOTP;
