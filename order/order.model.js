const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  cid: {
    type: String,
    required: true,
  },

  billid: {
    type: String,
    required: true,
  },

  items: [
    {
      pid: String,
      pname: String,
      qty: Number,
      price: Number,
    },
  ],

  total: {
    type: Number,
    default: 0,
  },

  paymentId: String,
  orderId: String,

  status: {
    type: String,
    default: "Placed",
    enum: [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Return Requested",
      "Returned",
    ],
  },

  cancelReason: {
    type: String,
    default: "",
  },

  returnReason: {
    type: String,
    default: "",
  },

  isReturned: {
    type: Boolean,
    default: false,
  },

  isCancelled: {
    type: Boolean,
    default: false,
  },

  deliveredDate: {
    type: Date,
    default: null,
  },

  date: {
    type: Date,
    default: Date.now,
  },

returnApproved: {
  type: Boolean,
  default: false,
},

returnRejected: {
  type: Boolean,
  default: false,
},

date: {
  type: Date,
  default: Date.now,
},
refundStatus: {
  type: String,
  enum: [
    "Not Required",
    "Pending",
    "Refunded"
  ],
  default: "Not Required",
},

refundAmount: {
  type: Number,
  default: 0,
},

refundDate: {
  type: Date,
  default: null,
},




customerName: {
  type: String,
  default: "",
},

mobile: {
  type: String,
  default: "",
},
address: {
  house: String,
  area: String,
  landmark: String,
  city: String,
  state: String,
  pincode: String,
},

deliveryType: {
  type: String,
  enum: ["Standard", "Express"],
  default: "Standard",
},

paymentMethod: {
  type: String,
  enum: ["Online", "COD"],
  default: "Online",
},

paymentStatus: {
  type: String,
  enum: ["Pending", "Paid"],
  default: "Pending",
},

});



module.exports = mongoose.model("Order", OrderSchema);