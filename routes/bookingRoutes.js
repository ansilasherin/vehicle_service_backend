const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");

// ✅ CREATE BOOKING (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { service, date, time } = req.body;

    if (!service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Service, date, time required",
      });
    }

    const booking = await Booking.create({
      userId: req.user.id, // from verified JWT token
      service,
      date,
      time,
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Booking created",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET USER'S OWN BOOKINGS (Protected)
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const myBookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: myBookings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET ALL BOOKINGS (Admin/General)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ UPDATE BOOKING STATUS (e.g. paid, completed, cancelled)
router.put("/:id/status", async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({
      success: true,
      message: "Booking status updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
