const express = require("express");
const router = express.Router();

const Newsletter = require("./newsletter.model");
const nodemailer = require("nodemailer");

// ==================== MAIL CONFIG ====================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,

  },
});

// ==================== SUBSCRIBE ====================

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check Existing
    const exist = await Newsletter.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    // Save
    const subscriber = new Newsletter({
      email,
    });

    await subscriber.save();

    // Welcome Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to ShopNexa 🎉",

      html: `
      <h2>Welcome to ShopNexa 🎉</h2>

      <p>Hello,</p>

      <p>Thank you for subscribing to <b>ShopNexa</b>.</p>

      <p>You will receive:</p>

      <ul>
        <li>✅ New Product Updates</li>
        <li>✅ Discount Offers</li>
        <li>✅ Flash Sale Alerts</li>
      </ul>

      <br>

      <p>Happy Shopping ❤️</p>

      <h3>Team ShopNexa</h3>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Subscribed Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});

module.exports = router;