const mongoose = require("mongoose");

const schema = new mongoose.Schema({
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
    default: true
},
  expiresAt: {
    type: Date,
  },
});

module.exports = schema;
