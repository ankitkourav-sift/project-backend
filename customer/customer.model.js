const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    CUserId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    CUserPass: {
      type: String,
      required: true,
    },

    CustomerName: {
      type: String,
      required: true,
    },

    StId: {
      type: Number,
      required: true,
    },

    CtId: {
      type: Number,
      required: true,
    },

    CAddress: {
      type: String,
      required: true,
    },

    CContact: {
      type: Number,
      required: true,
    },

    CEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    CPicName: {
      type: String,
      default: "",
    },

    Cid: {
      type: Number,
      unique: true,
    },

    Status: {
      type: String,
      default: "Inactive",
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "Customer",
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);