const { ExpiredOTPError, UserNotFoundError } = require("../../../common/error/error");
const MailService = require("../../mail/services/mail.service");
const UserService = require("../../user/services/user.services");
const OTPRepository = require("../repositories/otp.repo");

class OTPService {
  static async generate(email,purpose) {
    try {
      const {user} = await UserService.getUserByEmail(email);
      console.log("user : ",user);
      if (!user) {
        throw new UserNotFoundError();
      }

      const { success, otp, error } = await OTPRepository.generateCode(user,purpose);

      if (!success) {
        throw error;
      }

      await MailService.sendOTP(user.email, otp.code, purpose);

      return { success: true, otp };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async validate(email, code, purpose) {
    try {
      const {user} = await UserService.getUserByEmail(email);

      if (!user) {
        throw new UserNotFoundError();
      }
      const { success: findSuccess, otp, error: findError } = await OTPRepository.findValidCodeByUser(code, user, purpose);

      if (!findSuccess) {
        throw findError;
      }

      if (otp.isExpired()) {
        throw new ExpiredOTPError();
      }
      const { success: markSuccess, error: markError } = await OTPRepository.markAsUsed(otp);

      if (!markSuccess) {
        throw markError;
      }

      return { success: true };
    } catch (error) {
      
      return { success: false, error };
    }
  }
}

module.exports = OTPService;
