require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

// Standard electronic/audio product sub-names
const productNames = [
  "Wireless Pro",
  "Immersive Sound",
  "Acoustic Wave",
  "Active Active",
  "Elite Edition",
  "Sonic Blast",
  "Urban Pulse",
  "Vibe Touch",
  "Stealth Glide",
  "Carbon Series",
  "Neon Stream",
  "Alpha Pack",
  "Titan Frame",
  "Nomad Core",
  "Element Prime",
  "Matrix Fit",
  "Cortex Sync",
  "Quantum Air"
];

// Dedicated realistic names specifically for the Accessories category
const accessoryNames = [
  "Turbo Charge 20W",
  "Armor Shell Case",
  "Ultra Durable Type-C",
  "MagSafe Power Core",
  "Ergo Stand Pro",
  "Braided Nylon Link",
  "Travel Tech Organizer",
  "Nano Power Bank"
];

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const paymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (arr) => arr[random(0, arr.length - 1)];

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

async function seed() {
  await connectDB();

  // 1. Fetch existing users (Will NOT overwrite or change them)
  const users = await User.find();
  if (!users.length) {
    console.log("No users found in database. Please seed users first.");
    process.exit();
  }

  // 2. Fetch active categories (Will NOT overwrite or change them)
  const categories = await Category.find({ isActive: true });
  if (!categories.length) {
    console.log("No active categories found in database. Please seed categories first.");
    process.exit();
  }

  // 3. Wiping ONLY products and orders demo history clean
  console.log("Removing old product and order demo data...");
  await Order.deleteMany({});
  await Product.deleteMany({});
  console.log("Previous product and order data successfully cleared.");

  console.log("Creating fresh products...");
  const products = [];

  for (let i = 1; i <= 40; i++) {
    const categoryDoc = pick(categories); 
    
    // Exact mapping including your correct Accessories link
    const categoryImageMap = {
      "Gaming Headphones": "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/assets/IM1300.png",
      "Smart Watches": "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/assets/dark-smartwatch.png?updatedAt=1782567921130",
      "Headphones": "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/assets/dark-headphones.png?updatedAt=1782567921735",
      "Bluetooth Speakers": "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/assets/product-bluetooth-speaker.png",
      "Health and Fitness": "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/assets/fitness%20tracker%20band.png",
      "TWS": "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/assets/p-earbuds.png?updatedAt=1782617694574",
      "Accessories": "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/products/covers/Power%20Bank.png"
    };

    // Normalize category name to prevent simple casing/spacing issues from breaking the image match
    const categoryKey = Object.keys(categoryImageMap).find(
      key => key.toLowerCase().trim() === categoryDoc.name.toLowerCase().trim()
    ) || categoryDoc.name;

    const cleanCategoryName = categoryDoc.name.toLowerCase().replace(/\s+/g, '');
    const assignedImage = categoryImageMap[categoryKey] || `https://loremflickr.com/400/400/${cleanCategoryName}`;

    // Dynamically assign realistic sub-names based on whether it is an accessory or standard electronic item
    const isAccessory = categoryKey.toLowerCase() === "accessories";
    const selectedSubName = isAccessory ? pick(accessoryNames) : pick(productNames);

    // Calculate baseline discounted price
    const sellingPrice = isAccessory ? random(499, 2999) : random(999, 14999);
    
    // Calculate an original MRP that satisfies the mongoose validator (mrp >= price)
    // Adjusting range slightly to create some massive discounts! (up to 60%)
    const markupPercent = random(10, 60); 
    const calculatedMRP = Math.round(sellingPrice * (1 + markupPercent / 100));

    // --- NEW: Calculate the exact discount percentage ---
    const discount = calculatedMRP > 0 ? Math.round(((calculatedMRP - sellingPrice) / calculatedMRP) * 100) : 0;

    products.push({
      name: `${categoryDoc.name} - ${selectedSubName}`,
      description: isAccessory 
        ? `Premium high-performance tech accessory designed to protect and power up your daily essentials.` 
        : `Premium quality high-fidelity ${categoryDoc.name.toLowerCase()} built for everyday performance.`,
      category: categoryDoc._id, 
      price: sellingPrice, 
      mrp: calculatedMRP,
      discount, // <-- Injected here
      stock: random(20, 150),
      salesCount: 0,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), 
      numReviews: random(10, 450),
      coverImage: assignedImage, 
      images: [assignedImage],   
      highlights: ["Premium Quality", "Brand Warranty", "Best Seller"],
      tags: [],
      isActive: true,
      createdBy: pick(users)._id,
    });
  }

  const savedProducts = await Product.insertMany(products);

  console.log("Creating synchronized random customer orders...");
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025
  const endDate = new Date(); // Today

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const ordersToday = random(1, 4); 

    for (let i = 0; i < ordersToday; i++) {
      const user = pick(users);
      const itemCount = random(1, 3);
      const items = [];
      let total = 0;

      for (let j = 0; j < itemCount; j++) {
        const product = pick(savedProducts);
        const qty = random(1, 2);

        total += product.price * qty;

        items.push({
          product: product._id,
          name: product.name,
          image: product.coverImage,
          price: product.price,
          quantity: qty,
        });

        product.salesCount += qty;
        product.stock = Math.max(product.stock - qty, 0);
      }

      const createdAt = new Date(currentDate);
      createdAt.setHours(random(9, 21), random(0, 59), random(0, 59), 0);

      const order = new Order({
        user: user._id,
        items,
        totalAmount: total,
        paymentStatus: pick(paymentStatuses),
        orderStatus: pick(orderStatuses),
        shippingAddress: {
          fullName: "Test Customer",
          phone: "9876543210",
          addressLine1: "Apt 4B, Sector 62",
          addressLine2: "Noida Electronic City",
          city: "Delhi-NCR",
          state: "Delhi",
          pincode: "201301",
          country: "India",
        },
        createdAt,
        updatedAt: createdAt,
      });

      await order.save();
    }
  }

  console.log("Finalizing stock and order synchronization fields...");
  for (const product of savedProducts) {
    await product.save();
  }

  console.log("Database successfully populated with clean items and orders!");
  process.exit();
}

seed();