const { AppError } = require('../../../common/error/error');
const OTPService = require('../services/otp.service');

class OTPController {
  static async generateOTP(req, res) {
    try {
      const { email, purpose } = req.body;

      if (!email) {
        throw new AppError('Email is required', 400);
      }

      const { success, otp, error } = await OTPService.generate(email,purpose);

      if (success) {
        res.status(200).json({ success: true, otp });
      } else {
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }

  static async validateOTP(req, res) {
    try {
      const { email, code, purpose } = req.body;

      if (!email || !code) {
        throw new AppError('Email and code are required', 400);
      }

      const { success, error } = await OTPService.validate(email, code, purpose);

      if (success) {
        res.status(200).json({ success: true });
      } else {
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }
}

module.exports = OTPController;
