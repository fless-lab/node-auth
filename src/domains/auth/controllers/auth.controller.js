const createError = require("http-errors");
const { AppError } = require("../../../common/error/error");
const {
  loginSchema,
  verifyAccountSchema,
} = require("../../../common/validation/schemas");
const AuthService = require("../services/auth.service");

class AuthController {

  static async register(req, res, next) {
    try {
      const body = {
        email:req.body.email,
        password:req.body.password,
      }
      if(req.file){body.avatar=req.file.filename}
      console.log("final body : ",body)
      const { success, user, otp, error } = await AuthService.register(body);

      if (success) {
        return res.status(201).json({ success, user, otp });
      } else {
        throw error;
      }
    } catch (error) {
      console.log("error : ",error)
      // if (error.isJoi === true)
      // console.log("error : ",error)
      //   return next(createError.BadRequest("Invalid Params Entered"));
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async verifyAccount(req, res) {
    try {
      const body = {
        email:req.body.email,
        code:req.body.code,
      }
      const { success, error } = await AuthService.verifyAccount(body);

      if (!success) {
        throw error;
      }
      return res.status(200).json({ success });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const body = {
        email:req.body.email,
        password:req.body.password,
      }

      const { success, user, token, error } = await AuthService.login(body);

      if (success) {
        return res.status(200).json({ success, token, user });
      } else {
        throw error;
      }
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      const { success, token, error } = await AuthService.refresh(refreshToken);

      if (success) {
        return res.status(200).json({ success, token });
      } else {
        throw error;
      }
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const { success, error } = await AuthService.logout(refreshToken);

      if (success) {
        return res.status(200).json({ success });
      } else {
        throw error;
      }
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }


  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const { success, error } = await AuthService.forgotPassword(email);

      if (success) {
        return res.status(200).json({ success });
      } else {
        throw error;
      }
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const body = {
        email:req.body.email,
        password:req.body.password,
        code:req.body.code
      }

      const { success, error } = await AuthService.resetPassword(body);

      if (success) {
        return res.status(200).json({ success });
      } else {
        throw error;
      }
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
  
}

module.exports = AuthController;
