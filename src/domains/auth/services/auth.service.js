const createError = require("http-errors");
const { AppError, UserNotFoundError } = require("../../../common/error/error");
const UserService = require("../../user/services/user.services");
const OTPService = require("../../otp/services/otp.service");
const MailService = require("../../mail/services/mail.service");
const { OTP_PURPOSE } = require("../../../../constants");

const redis = require("../../../common/cache/redis");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../../../common/jwt/jwt");

const client = redis.getClient();

class AuthService {
  static async register(payload) {
    try {
      const { email } = payload;
      const { user: exitingUser } = await UserService.getUserByEmail(email);
      if (exitingUser)
        throw new AppError(
          "The entered email is already been registered.",
          409
        );

      const {
        success: createSuccess,
        user: createdUser,
        error: createError,
      } = await UserService.createUser(payload);

      if (!createSuccess) {
        throw createError;
      }
      const {
        success: generateSuccess,
        otp,
        error: generateError,
      } = await OTPService.generate(email, OTP_PURPOSE.ACCOUNT_VERIFICATION);

      if (!generateSuccess) {
        throw generateError;
      }
      return { success: true, user: createdUser, otp };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async verifyAccount(payload) {
    try {
      const { email, code } = payload;

      const { success, verified, error } = await UserService.isVerified(email);

      if (verified) {
        return {
          success: false,
          error: new AppError("Account is already verified.", 400),
        };
      }

      const { success: validateSuccess, error: validateError } =
        await OTPService.validate(
          email,
          code,
          OTP_PURPOSE.ACCOUNT_VERIFICATION
        );

      if (!validateSuccess) {
        throw validateError;
      }
      const { success: verifySuccess, error: verifyError } =
        await UserService.markAsVerified(email);

      if (!verifySuccess) {
        throw verifyError;
      }

      const mailService = new MailService();

      const mailOptions = {
        to: email,
        subject: "Account Verification Successful",
        text: "Your account has been successfully verified. Thank you for using our service!",
      };

      await mailService.send(mailOptions);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async login(payload) {
    try {
      const { email, password } = payload;
      const { user: exitingUser } = await UserService.getUserByEmail(email);
      if (!exitingUser) throw new UserNotFoundError();

      const isMatch = await exitingUser.isValidPassword(password);

      if (!isMatch) throw createError.Unauthorized("Invalid credentials.");

      if (!exitingUser.verified)
        throw createError.Unauthorized("Unverified account.");

      if (!exitingUser.active)
        throw createError.Unauthorized(
          "Inactive account, Please contact admins."
        );

      const access = await signAccessToken(exitingUser.id);
      const refresh = await signRefreshToken(exitingUser.id);

      return { success: true, token: { access, refresh }, user: exitingUser };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async refresh(refreshToken) {
    try {
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const access = await signAccessToken(userId);
      const refresh = await signRefreshToken(userId);
      return { success: true, token: { access, refresh } };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async logout(refreshToken) {
    try {
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const delPromise = new Promise((resolve, reject) => {
        client.DEL(userId, (err, val) => {
          if (err) {
            reject(createError.InternalServerError());
          } else {
            resolve({ success: true });
          }
        });
      });

      return await delPromise;
    } catch (error) {
      return { success: false, error };
    }
  }

  static async forgotPassword(email) {
    try {
      if (!email) {
        throw new Error("Email should be provided", 400);
      }

      const { user: exitingUser } = await UserService.getUserByEmail(email);

      if (!exitingUser) throw new UserNotFoundError();

      if (!exitingUser.verified)
        throw createError.Unauthorized("Unverified account.");

      if (!exitingUser.active)
        throw createError.Unauthorized(
          "Inactive account, Please contact admins."
        );

      const {
        success: generateSuccess,
        otp,
        error: generateError,
      } = await OTPService.generate(email, OTP_PURPOSE.FORGOT_PASSWORD);

      if (!generateSuccess) {
        throw generateError;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async resetPassword(payload) {
    try {
      const { email, code, password } = payload;
      const { user: exitingUser } = await UserService.getUserByEmail(email);
      if (!exitingUser) throw new UserNotFoundError();

      if (!exitingUser.verified)
        throw createError.Unauthorized("Unverified account.");

      if (!exitingUser.active)
        throw createError.Unauthorized(
          "Inactive account, Please contact admins."
        );

      const { success: validateSuccess, error: validateError } =
        await OTPService.validate(email, code, OTP_PURPOSE.FORGOT_PASSWORD);

      if (!validateSuccess) {
        throw validateError;
      }

      exitingUser.updatePassword(password);

      await exitingUser.save();

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

module.exports = AuthService;
