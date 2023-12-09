const { AppError } = require('../../../common/error/error');
const UserModel = require('../models/user.model');

class UserRepository {
  static async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new AppError(`Error finding user by email: ${error.message}`);
    }
  }

  static async save(user) {
    try {
      await user.save();
      return { success: true };
    } catch (error) {
      throw new AppError(`Error saving user: ${error.message}`);
    }
  }

  static async create(userData) {
    console.log("user data is : ",userData)
    try {
      const user = new UserModel(userData);
      await user.save();
      return { success: true, user };
    } catch (error) {
      throw new AppError(`Error creating user: ${error.message}`);
    }
  }

  static async markAsVerified(user) {
    try {
      user.verified = true;
      await user.save();
      return { success: true };
    } catch (error) {
      throw new AppError(`Error marking user as verified: ${error.message}`);
    }
  }

  static async delete(user) {
    try {
      await UserModel.deleteOne({_id:user._id});
      return { success: true };
    } catch (error) {
      throw new AppError(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = UserRepository;