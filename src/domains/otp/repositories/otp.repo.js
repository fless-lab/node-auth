const config = require("../../../../config");
const { generateRandomOTP } = require("../../../../utilities/generator");
const { AppError } = require("../../../common/error/error");
const OTPModel = require("../models/otp.model");

class OTP {
  constructor({ code, user, expiresAt, used, isFresh, purpose }) {
    this.code = code;
    this.user = user;
    this.expiresAt = expiresAt;
    this.used = used;
    this.isFresh = isFresh;
    this.purpose = purpose;
  }

  static async generateCode(user,purpose) {
    try {
      await this.invalidateOldCodes(user,purpose);
      const otp = new OTP({
        code: generateRandomOTP(config.otp.length),
        expiresAt: new Date(Date.now() + config.otp.expiration),
        user: user._id,
        purpose: purpose
      });

      await otp.save();
      return { success: true, otp };
    } catch (error) {
      return { success: false, error: new AppError(error.message, 500) };
    }
  }

  async save() {
    try {
      const otpModel = new OTPModel(this);
      await otpModel.save();
      return { success: true };
    } catch (error) {
      return { success: false, error: new AppError(error.message, 500) };
    }
  }

  static async markAsUsed(otp) {
    try {
      otp.markAsUsed();
      await otp.save();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  isExpired() {
    return Date.now() < this.expiresAt;
  }

  static async isValid(code) {
    try {
      const otp = await OTPModel.findOne({ code, isFresh: true, used: false });
      return { success: true, isValid: otp ? otp.expiresAt >= Date.now() : false };
    } catch (error) {
      return { success: false, error: new AppError(error.message, 500) };
    }
  }

  static async findValidCodeByUser(code, user, purpose) {
    try {
      console.log("code",code,purpose,user)
      const otp = await OTPModel.findOne({ code, user: user._id.toString(), isFresh: true, used: false, purpose });
      if (!otp) {
        throw new AppError('Invalid or expired OTP code', 404);      }
  
      return { success: true, otp };
    } catch (error) {
      return { success: false, error: new AppError(error.message, error.statusCode||500) };
    }
  }
  

  static async invalidateOldCodes(user,purpose) {
    try {
      await OTPModel.updateMany(
        { user: user._id, used: false, purpose },
        { $set: { isFresh: false } }
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: new AppError(error.message, 500) };
    }
  }
}

module.exports = OTP;