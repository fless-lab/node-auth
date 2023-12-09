require('dotenv').config()

module.exports = {
  otp: {
    expirationHour: process.env.OTP_EXPIRATION,
    expiration: parseInt(process.env.OTP_EXPIRATION, 10)*1000*60*60, //We convert from hour to ms
    length: parseInt(process.env.OTP_LENGTH, 10)
  }
}