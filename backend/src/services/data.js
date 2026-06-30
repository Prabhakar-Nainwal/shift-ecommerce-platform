require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/productModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

const productNames = [
  "Wireless Pro", "Immersive Sound", "Acoustic Wave", "Active Active",
  "Elite Edition", "Sonic Blast", "Urban Pulse", "Vibe Touch",
  "Stealth Glide", "Carbon Series", "Neon Stream", "Alpha Pack",
  "Titan Frame", "Nomad Core", "Element Prime", "Matrix Fit",
  "Cortex Sync", "Quantum Air"
];

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[random(0, arr.length - 1)];

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

async function seed() {
  await connectDB();

  // 1. Fetch existing users
  const users = await User.find();
  if (!users.length) {
    console.log("No users found in database. Please seed users first.");
    process.exit();
  }

  // 2. Fetch ONLY the Accessories category
  const accessoriesCategory = await Category.findOne({ name: "Accessories", isActive: true });
  if (!accessoriesCategory) {
    console.log("The 'Accessories' category was not found or is inactive. Please seed categories first.");
    process.exit();
  }

  console.log("Creating 20 fresh Accessories products...");
  const products = [];

  const assignedImage = "https://ik.imagekit.io/d6e6zfavs/Project_Urban_Shop/products/covers/Power%20Bank.png";

  for (let i = 1; i <= 20; i++) {
    products.push({
      name: `${accessoriesCategory.name} - ${pick(productNames)}`,
      description: `Premium quality high-fidelity ${accessoriesCategory.name.toLowerCase()} built for everyday performance.`,
      category: accessoriesCategory._id, 
      price: random(999, 14999), 
      stock: random(20, 150), // Fresh stock left entirely untouched
      salesCount: 0,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), 
      numReviews: random(10, 450),
      discountPercentage: random(5, 35),
      coverImage: assignedImage, 
      images: [assignedImage],   
      highlights: ["Premium Quality", "Brand Warranty", "Best Seller"],
      tags: [],
      isActive: true,
      createdBy: pick(users)._id,
    });
  }

  // Save products to database
  await Product.insertMany(products);

  console.log("Database successfully populated with 20 pure Accessories items!");
  process.exit();
}

seed();