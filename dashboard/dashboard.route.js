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

    const revenue = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    res.json({
      totalOrders,
      totalCustomers,
      totalProducts,
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

module.exports = router;