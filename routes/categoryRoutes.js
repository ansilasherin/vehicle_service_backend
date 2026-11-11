const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const defaultCategories = [
  {
    catname: "Two Wheeler",
    images: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
  },
  {
    catname: "Three Wheeler",
    images: "https://images.unsplash.com/photo-1596707328904-4c8d76a260f8?w=600&auto=format&fit=crop&q=80",
  },
  {
    catname: "Four Wheeler",
    images: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
  },
];

// Seed categories if empty
const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(defaultCategories);
    console.log("Default categories seeded to MongoDB");
  }
};

// GET ALL (Public for all users)
router.get("/", async (req, res) => {
  try {
    await seedCategories();
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { catname, images } = req.body;
    if (!catname || !images) {
      return res.status(400).json({ success: false, message: "catname and images required" });
    }
    const category = await Category.create({ catname, images });
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
