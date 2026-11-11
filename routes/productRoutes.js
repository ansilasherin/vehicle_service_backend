const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const defaultProducts = [
  {
    name: "Vega Crux Full Face Helmet",
    price: 1450,
    category: "Riding Gear",
    description: "ISI certified aerodynamic full face motorcycle helmet with anti-scratch visor.",
    images: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
    inStock: true,
  },
  {
    name: "Breathable Leatherette Seat Cover",
    price: 850,
    category: "Accessories",
    description: "Waterproof, heat-resistant anti-slip cushioned seat cover.",
    images: "https://images.unsplash.com/photo-1541348263662-e0c82661cb25?w=600&auto=format&fit=crop&q=80",
    inStock: true,
  },
  {
    name: "Pro-Biker Riding Gloves",
    price: 650,
    category: "Riding Gear",
    description: "Touchscreen compatible knuckle-protected breathable riding gloves.",
    images: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80",
    inStock: true,
  },
  {
    name: "Complete Vehicle Wash & Care Kit",
    price: 499,
    category: "Maintenance",
    description: "Ultra-soft microfiber cloth, shampoo & tire polish kit for car and bike.",
    images: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&auto=format&fit=crop&q=80",
    inStock: true,
  },
  {
    name: "Motul Chain Clean & Lube Combo",
    price: 920,
    category: "Maintenance",
    description: "High-performance chain lubricant and degreaser combo spray for motorcycles.",
    images: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    inStock: true,
  },
  {
    name: "Universal LED Fog Lights (Pair)",
    price: 1250,
    category: "Electrical",
    description: "Super bright dual-color LED auxiliary lights with mounting brackets.",
    images: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80",
    inStock: true,
  },
];

// Seed accessories if empty
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(defaultProducts);
    console.log("Default accessories/products seeded to MongoDB");
  }
};

// GET all products/accessories (Public)
router.get("/", async (req, res) => {
  try {
    await seedProducts();
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADD product (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, images, description, category } = req.body;
    if (!name || !price || !images) {
      return res.status(400).json({
        success: false,
        message: "Name, price and image URL are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      images,
      description: description || "",
      category: category || "Accessories",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE product (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE product order (User)
router.post("/order", authMiddleware, async (req, res) => {
  try {
    const { product, amount } = req.body;
    if (!product || !amount) {
      return res.status(400).json({
        success: false,
        message: "Product and amount required",
      });
    }

    const order = await Order.create({
      product,
      amount,
      userId: req.user.id,
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created, proceed to payment",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET logged-in user's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const myOrders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: myOrders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CONFIRM order after payment
router.put("/confirm/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order confirmed after payment ✅",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all orders (Admin only)
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
