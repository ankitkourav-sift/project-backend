require("dotenv").config();

const express = require("express");
const productRoute = express.Router();

const Product = require("./product.model");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { v2: cloudinary } = require("cloudinary");

const { createInventoryForNewProduct } = require("./inventory.route");

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("Cloudinary Ready");

// ================= CLOUDINARY STORAGE =================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({
  storage: storage,
});

// ================= GET MAX PID =================
productRoute.get("/getmaxpid", async (req, res) => {
  try {
    const products = await Product.find();

    res.send(products);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= SAVE PRODUCT =================
productRoute.post(
  "/saveproductimage",
  upload.single("file"),

  async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      let imageUrl = "";

      // ================= CLOUDINARY IMAGE URL =================
      if (req.file) {
        imageUrl = req.file.path;
      }

      const lastProduct = await Product.findOne().sort({ pid: -1 });

      const newPid = lastProduct ? lastProduct.pid + 1 : 1;

      const product = new Product({
        pid: newPid,
        pname: req.body.pname,
        pprice: req.body.pprice,
        oprice: req.body.oprice,
        pcatgid: req.body.pcatgid,
        vid: req.body.vid,
        status: "Active",
        ppicname: imageUrl,
      });

      await product.save();

      await createInventoryForNewProduct(
        product.pid,
        product.vid,
        0,
        {
          updatedBy: product.vid,
        }
      );

      res.json({
        success: true,
        message: "Product Added Successfully",
        product,
      });
    } catch (err) {
      console.log("SAVE ERROR:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// ================= SHOW PRODUCTS =================
productRoute.get("/showproduct", async (req, res) => {
  try {
    const products = await Product.find();

    res.send(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= PRODUCT BY VENDOR =================
productRoute.get("/showproductbyvender/:vid", async (req, res) => {
  try {
    const products = await Product.find({
      vid: req.params.vid,
    });

    res.send(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= UPDATE PRODUCT =================
productRoute.put(
  "/updateproduct/:pid",
  upload.single("file"),

  async (req, res) => {
    try {
      console.log("UPDATE BODY:", req.body);
      console.log("UPDATE FILE:", req.file);

      let updateData = {
        pname: req.body.pname,
        pprice: req.body.pprice,
        oprice: req.body.oprice,
        pcatgid: req.body.pcatgid,
        vid: req.body.vid,
        status: req.body.status,
      };

      // ================= NEW IMAGE =================
      if (req.file) {
        updateData.ppicname = req.file.path;
      }

      await Product.updateOne(
        { pid: req.params.pid },
        { $set: updateData }
      );

      res.json({
        success: true,
        message: "Product Updated Successfully",
      });
    } catch (err) {
      console.log("UPDATE ERROR:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// ================= PRODUCT BY CATEGORY =================
productRoute.get("/showproductbycatgid/:pcatgid", async (req, res) => {
  try {
    const products = await Product.find({
      pcatgid: Number(req.params.pcatgid),
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ================= PRODUCT BY STATUS =================
productRoute.get("/showproductstatus/:status", async (req, res) => {
  try {
    const products = await Product.find({
      status: req.params.status,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ================= UPDATE PRODUCT STATUS =================
productRoute.put("/updateproductstatus/:pid/:status", async (req, res) => {
  try {
    const { pid, status } = req.params;

    const product = await Product.findOneAndUpdate(
      { pid: Number(pid) },
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product status updated",
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = productRoute;