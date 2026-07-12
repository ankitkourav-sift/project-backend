const express = require("express");
const router = express.Router();

const Order = require("../order/order.model");
const Customer = require("../customer/customer.model");
const Product = require("../product/product.model");

// ================= DASHBOARD STATS =================
router.get("/stats", async (req, res) => {
  try {
    const totalOrders =
      await Order.countDocuments();

    const totalCustomers =
      await Customer.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const deliveredOrders =
      await Order.countDocuments({
        status: {
          $in: [
            "Delivered",
            "Returned",
            "success",
          ],
        },
      });

    const cancelledOrders =
      await Order.countDocuments({
        status: "Cancelled",
      });

    const pendingReturns =
      await Order.countDocuments({
        status: "Return Requested",
      });

    // Revenue Calculation
    const allDelivered =
      await Order.find({
        status: {
          $in: [
            "Delivered",
            "Returned",
            "success",
          ],
        },
      });

    console.log(
      "Revenue Orders:",
      allDelivered
    );

    const totalRevenue =
      allDelivered.reduce(
        (sum, order) =>
          sum + (order.total || 0),
        0
      );

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
      message: "Dashboard error",
    });
  }
});

// ================= ALL ORDER STATUS =================
router.get("/all-status", async (req, res) => {
  try {
    const data = await Order.find().select(
      "billid status returnApproved"
    );

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;