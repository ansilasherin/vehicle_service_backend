const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const defaultServices = [
  { categoryId: "1", name: "Bike Foam Washing", price: 200, description: "High pressure foam wash, degreasing & polish" },
  { categoryId: "1", name: "Bike Painting & Touchup", price: 500, description: "Scratch removal and panel painting" },
  { categoryId: "1", name: "General Bike Service", price: 950, description: "Engine oil change, chain adjustment, brake tuning" },
  { categoryId: "2", name: "Auto Rickshaw Full Service", price: 800, description: "Complete engine checkup, greasing and electrical check" },
  { categoryId: "3", name: "Car Foam Wash & Interior Vacuum", price: 600, description: "Full exterior wash, dashboard polish & vacuuming" },
  { categoryId: "3", name: "Car Periodic Maintenance Service", price: 2500, description: "Engine oil change, brake pads check, all fluids top-up" },
];

const seedServices = async () => {
  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany(defaultServices);
    console.log("Default services seeded to MongoDB");
  }
};

// GET ALL (Public)
router.get("/", async (req, res) => {
  try {
    await seedServices();
    const services = await Service.find();
    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET BY CATEGORY (Public)
router.get("/category/:categoryId", async (req, res) => {
  try {
    await seedServices();
    const result = await Service.find({ categoryId: req.params.categoryId });
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADD SERVICE (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, categoryId, description } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Name, price, categoryId required",
      });
    }

    const service = await Service.create({
      name,
      price,
      categoryId,
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Service added",
      data: service,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE SERVICE (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({
      success: true,
      message: "Service updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE SERVICE (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
