const express = require("express");
const router = express.Router();

const Address = require("./address.model");

// ================= ADD ADDRESS =================

router.post("/add", async (req, res) => {
  try {
    const {
      cid,
      fullName,
      mobile,
      house,
      area,
      landmark,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    // If this address is default, remove default from others
    if (isDefault) {
      await Address.updateMany(
        { cid },
        { $set: { isDefault: false } }
      );
    }

    const address = new Address({
      cid,
      fullName,
      mobile,
      house,
      area,
      landmark,
      city,
      state,
      pincode,
      isDefault,
    });

    await address.save();

    res.status(201).json({
      success: true,
      message: "Address Added Successfully",
      address,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Unable to Add Address",
    });
  }
});

// ================= GET ALL ADDRESSES =================

router.get("/:cid", async (req, res) => {
  try {

    const addresses = await Address.find({
      cid: req.params.cid,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      addresses,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Unable to Fetch Addresses",
    });
  }
});

// ================= SET DEFAULT ADDRESS =================

router.put("/default/:id", async (req, res) => {
  try {

    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address Not Found",
      });
    }

    await Address.updateMany(
      { cid: address.cid },
      { $set: { isDefault: false } }
    );

    address.isDefault = true;

    await address.save();

    res.json({
      success: true,
      message: "Default Address Updated",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

// ================= UPDATE ADDRESS =================

router.put("/update/:id", async (req, res) => {
  try {

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Address Updated",
      updated,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

// ================= DELETE ADDRESS =================

router.delete("/:id", async (req, res) => {
  try {

    await Address.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Address Deleted",
    });

  } catch (err) {
  console.error("ADDRESS ERROR =>", err);

  res.status(500).json({
    success: false,
    message: err.message,
    error: err,
  });
}
});

module.exports = router;