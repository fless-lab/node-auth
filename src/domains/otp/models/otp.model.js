const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  isFresh: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
  purpose: {
    type: String,
    enum: ['ACCOUNT_VERIFICATION', 'FORGOT_PASSWORD'],
    required: true,
  },
});

otpSchema.methods.isExpired = function() {
  return this.expiresAt ? Date.now() > this.expiresAt : true;
};

otpSchema.methods.markAsUsed = function () {
  this.used = true;
};

const OTPModel = mongoose.model("OTP", otpSchema);
module.exports = OTPModel;