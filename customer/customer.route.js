const express = require("express");
const customerRoute = express.Router();

const Customer = require("./customer.model");

const multer = require("multer");
const nodemailer = require("nodemailer");

const cloudinary = require("../cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ================= CLOUDINARY STORAGE =================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "customer_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// ================= EMAIL SETUP =================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= SEND REGISTRATION MAIL =================

function sendGMail(mailto) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: mailto,
    subject: "Registration Success",
    text: "Your registration is successful. Wait for admin approval.",
  });
}

// ================= REGISTER =================

customerRoute.post(
  "/register",
  upload.single("file"),
  async (req, res) => {
    try {

      // CHECK EXISTING USER
      const oldUser = await Customer.findOne({
        CUserId: req.body.CUserId,
      });

      if (oldUser) {
        return res.status(400).json({
          success: false,
          message: "User ID already exists",
        });
      }

      // CREATE CUSTOMER
      const customer = new Customer({
        ...req.body,
        CPicName: req.file ? req.file.path : "",
      });

      await customer.save();

      // SEND MAIL
      await sendGMail(req.body.CEmail);

      res.status(200).json({
        success: true,
        message: "Registration successful",
        customer,
      });

    } catch (err) {

      console.log("REGISTER ERROR:", err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// ================= LOGIN =================
customerRoute.post("/login", async (req, res) => {

  try {

    const customer = await Customer.findOne({
      CUserId: req.body.CUserId,
      CUserPass: req.body.CUserPass,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      customer,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= CUSTOMER COUNT =================
customerRoute.get("/getcustomercount", async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne()
      .sort({ Cid: -1 })
      .select("Cid");

    const nextCid = lastCustomer ? Number(lastCustomer.Cid) + 1 : 1;

    res.json({ count: nextCid });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting customer id" });
  }
});
// ================= GET CUSTOMER DETAILS =================

customerRoute.get("/getcustomerdetails/:cid", async (req, res) => {
  try {
    const customer = await Customer.findOne({
      Cid: req.params.cid,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= CUSTOMER LIST =================

customerRoute.get("/getcustomerlist", async (req, res) => {
  try {
    const customers = await Customer.find();

    res.json(customers);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= UPDATE PROFILE =================

customerRoute.put(
  "/update/:cid",
  upload.single("file"),
  async (req, res) => {
    try {
      const customer = await Customer.findOne({
        Cid: req.params.cid,
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      customer.CustomerName = req.body.CustomerName;
      customer.CAddress = req.body.CAddress;
      customer.CContact = req.body.CContact;
      customer.CEmail = req.body.CEmail;
      customer.CUserId = req.body.CUserId;
      customer.StId = req.body.StId;
      customer.CtId = req.body.CtId;

      // IMAGE UPDATE
      if (req.file) {
        customer.CPicName = req.file.path;
      }

      await customer.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        customer,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// ================= CHANGE PASSWORD =================

customerRoute.post("/changepassword", async (req, res) => {
  try {
    const { CUserId, OldPassword, NewPassword } = req.body;

    const customer = await Customer.findOne({ CUserId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (customer.CUserPass !== OldPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    customer.CUserPass = NewPassword;

    await customer.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= ACTIVATE / DEACTIVATE =================

customerRoute.put("/customermanage/:cid/:status", async (req, res) => {
  try {
    await Customer.updateOne(
      { Cid: req.params.cid },
      { Status: req.params.status }
    );

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= SEND OTP =================

customerRoute.post("/forgotpassword/send-otp", async (req, res) => {
  try {
    const { CUserId } = req.body;

    const customer = await Customer.findOne({ CUserId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // GENERATE OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    customer.otp = otp;

    customer.otpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await customer.save();

    // SEND EMAIL

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customer.CEmail,
      subject: "OTP for Password Reset",
      text: `Your OTP is: ${otp}`,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
});

// ================= VERIFY OTP =================

customerRoute.post("/forgotpassword/verify-otp", async (req, res) => {
  try {
    const { CUserId, OTP } = req.body;

    const customer = await Customer.findOne({ CUserId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (customer.otp !== OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (customer.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
    });
  }
});

// ================= CHANGE PASSWORD =================

customerRoute.post(
  "/forgotpassword/change-password",
  async (req, res) => {
    try {
      const { CUserId, NewPassword } = req.body;

      const customer = await Customer.findOne({
        CUserId,
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      customer.CUserPass = NewPassword;

      // CLEAR OTP
      customer.otp = "";

      customer.otpExpiry = null;

      await customer.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Error changing password",
      });
    }
  }
);

module.exports = customerRoute;