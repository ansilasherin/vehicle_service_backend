const express = require("express");
const router = express.Router();
const UserDetails = require("../models/UserDetails");

// ✅ CREATE USER DETAILS
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phonenmbr,
      vehicleNumber,
      vehicleModel,
      pincode,
      state,
      streetaddress,
      username,
    } = req.body;

    if (!name || !phonenmbr || !vehicleNumber || !vehicleModel) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, vehicle number and model required",
      });
    }

    const user = await UserDetails.create({
      name,
      phonenmbr,
      vehicleNumber,
      vehicleModel,
      pincode: pincode || "",
      state: state || "",
      streetaddress: streetaddress || "",
      username: username || "",
    });

    res.status(201).json({
      success: true,
      message: "User details saved",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const userDetails = await UserDetails.find();
    res.json({
      success: true,
      message: "User details fetched",
      data: userDetails,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const updated = await UserDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await UserDetails.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
