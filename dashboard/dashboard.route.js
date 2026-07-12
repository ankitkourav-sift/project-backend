const express = require("express");
const router = express.Router();
const Order = require("../order/order.model");
const Customer = require("../customer/customer.model");
const Product = require("../product/product.model");

router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();

    const deliveredOrders = await Order.countDocuments({
  status: {
    $in: ["Delivered", "Returned"],
  },
});

    const cancelledOrders = await Order.countDocuments({
      status: "Cancelled",
    });

    const pendingReturns = await Order.countDocuments({
      status: "Return Requested",
    });

    const revenue = await Order.aggregate([
  {
    $match: {
      status: "Delivered",
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$total",
      },
    },
  },
]);

    res.json({
      totalCustomers,
      totalProducts,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      pendingReturns,
      totalRevenue:
        revenue.length > 0
          ? revenue[0].total
          : 0,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Dashboard error",
    });
  }
});

router.get("/all-status", async (req, res) => {
  try {
    const data = await Order.find().select(
      "billid status returnApproved"
    );

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;