const { AppError } = require("../../../common/error/error");
const UserRepository = require("../repositories/user.repo");

class UserService {
  static async getUserByEmail(email) {
    try {
      const user = await UserRepository.findByEmail(email);
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async isVerified(email) {
    try {
      const { user } = await this.getUserByEmail(email);
      return { success: true, verified: user.verified };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async createUser(userData) {
    try {
      const { success, user ,error } = await UserRepository.create(userData);
      if (!success) {
        throw error;
      }
      return { success, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async markAsVerified(email) {
    try {
      const {
        success: findSuccess,
        user,
        error: findError,
      } = await this.getUserByEmail(email);

      if (!findSuccess) {
        throw findError;
      }

      if (user.verified) {
        throw new UserAlreadyVerifiedError("User is already verified.");
      }

      const { success: markSuccess, error: markError } =
        await UserRepository.markAsVerified(user);

      if (!markSuccess) {
        throw markError;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: new AppError(error.message, 500) };
    }
  }

  static async deleteUser(email) {
    try {
      const {
        success: findSuccess,
        user,
        error: findError,
      } = await this.getUserByEmail(email);

      if (!findSuccess) {
        throw findError;
      }

      const { success: deleteSuccess, error: deleteError } =
        await UserRepository.delete(user);

      if (!deleteSuccess) {
        throw deleteError;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: new AppError(error.message, 500) };
    }
  }
}

module.exports = UserService;
