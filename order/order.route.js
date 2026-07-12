const express = require("express");
const router = express.Router();
const Order = require("./order.model");

// ================= SAVE ORDER =================
router.post("/payment-success", async (req, res) => {
  try {
    const data = req.body;

    const total = (data.items || []).reduce(
      (sum, item) => sum + (item.qty || 0) * (item.price || 0),
      0
    );

    const order = new Order({
      cid: String(data.cid),
      billid: data.billid,
      items: data.items || [],
      total,
      paymentId: data.razorpayPaymentId,
      orderId: data.razorpayOrderId,
      status: "Processing",
    });

    await order.save();

    res.json({ message: "Order saved successfully", order });

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json(err);
  }
});


// ================= GET ORDERS BY CUSTOMER =================
router.get("/getorders/:cid", async (req, res) => {
  try {
    const cid = String(req.params.cid);

    console.log("Requested CID:", cid);

    const data = await Order.find({ cid });

    console.log("Found Orders:", data.length);

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});
// ================= GET SINGLE ORDER =================
router.get("/getorder/:billid", async (req, res) => {
  try {
    const data = await Order.findOne({ billid: req.params.billid });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= CANCEL ORDER =================
router.put("/cancel/:billid", async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      billid: req.params.billid,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled",
      });
    }

    order.status = "Cancelled";
    order.isCancelled = true;
    order.cancelReason = reason;
    order.refundStatus = "Pending";
    order.refundAmount = order.total;

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// ================= RETURN ORDER =================
router.put("/return/:billid", async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      billid: req.params.billid,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        message:
          "Return allowed only after delivery",
      });
    }

    order.status = "Return Requested";
    order.isReturned = true;
    order.returnReason = reason;

    await order.save();

    res.json({
      message: "Return request submitted",
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// ================= UPDATE ORDER STATUS =================
router.put("/status/:billid", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOne({
      billid: req.params.billid,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    if (status === "Delivered") {
      order.deliveredDate = new Date();
    }

    await order.save();

    res.json({
      message: "Status updated",
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// ================= GET RETURN REQUESTS =================
router.get("/return-requests", async (req, res) => {
  try {
    const orders = await Order.find({
      status: "Return Requested",
    });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error fetching return requests",
    });
  }
});


// ================= APPROVE RETURN =================
router.put("/approve-return/:billid", async (req, res) => {
  try {
    const order = await Order.findOne({
      billid: req.params.billid,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = "Returned";
    order.returnApproved = true;
    order.returnRejected = false;
    order.refundStatus = "Pending";
    order.refundAmount = order.total;

    await order.save();

    res.json({
      message: "Return approved",
      order,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= REJECT RETURN =================
router.put("/reject-return/:billid", async (req, res) => {
  try {
    const order = await Order.findOne({
      billid: req.params.billid,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = "Delivered";
    order.returnApproved = false;
    order.returnRejected = true;
    await order.save();

    res.json({
      message: "Return rejected",
      order,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= GET REFUND REQUESTS =================
router.get("/refund-requests", async (req, res) => {
  try {
    const orders = await Order.find({
      refundStatus: "Pending",
    });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


//=========================================
router.put("/refund/:billid", async (req, res) => {
  try {
    const order = await Order.findOne({
      billid: req.params.billid,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.refundStatus = "Refunded";
    order.refundDate = new Date();

    await order.save();

    res.json({
      message: "Refund completed",
      order,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;