const express = require("express");
const router = express.Router();
const Customer = require("../customer/customer.model");
const Product = require("../product/product.model");
const Order = require("../order/order.model");

router.get("/stats", async (req, res) => {
  try {
    const totalCustomers =
      await Customer.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const deliveredOrders =
      await Order.countDocuments({
        status: "Delivered",
      });

    const cancelledOrders =
      await Order.countDocuments({
        status: "Cancelled",
      });

    const pendingReturns =
      await Order.countDocuments({
        status: "Return Requested",
      });

    const revenueData =
      await Order.aggregate([
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

    const totalRevenue =
      revenueData[0]?.total || 0;

    res.json({
      totalCustomers,
      totalProducts,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      pendingReturns,
      totalRevenue,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;