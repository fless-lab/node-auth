class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class InvalidOTPError extends AppError {
  constructor(message = "Invalid OTP") {
    super(message, 400); // 400: Bad Request
  }
}

class ExpiredOTPError extends AppError {
  constructor(message = "Expired OTP") {
    super(message, 400); // 400: Bad Request
  }
}

class UserNotFoundError extends AppError {
  constructor(message = "User not found") {
    super(message, 404); // 404: Not Found
  }
}

class MailServiceError extends AppError {
  constructor(message) {
    super(message);
  }
}

class UserAlreadyVerifiedError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = {
  AppError,
  InvalidOTPError,
  ExpiredOTPError,
  UserNotFoundError,
  MailServiceError,
  UserAlreadyVerifiedError
};
