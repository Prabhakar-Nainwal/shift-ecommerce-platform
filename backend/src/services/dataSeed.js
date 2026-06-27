require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

const categories = [
  "Electronics",
  "Books",
  "Accessories",
  "Beauty",
  "Sports",
  "Decoration",
  "Toys",
  "others",
];

const brands = [
  "Sony",
  "Apple",
  "Samsung",
  "Nike",
  "Boat",
  "HP",
  "Dell",
  "Logitech",
  "Cosmic",
  "Puma",
];

const productNames = [
  "Wireless Headphones",
  "Gaming Mouse",
  "Bluetooth Speaker",
  "Keyboard",
  "Laptop Stand",
  "Football",
  "Yoga Mat",
  "Novel",
  "Desk Lamp",
  "Smart Watch",
  "Toy Car",
  "Basketball",
  "Coffee Mug",
  "LED Strip",
  "Monitor",
  "Webcam",
  "Power Bank",
  "USB Hub",
  "Microphone",
  "Fitness Band",
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

  const users = await User.find();

  if (!users.length) {
    console.log("No users found.");
    process.exit();
  }

  console.log("Removing old demo data...");

  await Order.deleteMany({});
  await Product.deleteMany({});

  console.log("Creating products...");

  const products = [];

  for (let i = 1; i <=40; i++) {
    const category = pick(categories);

    products.push({
      name: `${pick(productNames)} ${i}`,
      description: "Dummy product",
      category,
      brand: pick(brands),
      price: random(200, 12000),
      stock: random(20, 150),
      salesCount: 0,
      rating: Number((Math.random() * 5).toFixed(1)),
      numReviews: random(0, 500),
      discountPercentage: random(0, 40),
      coverImage: "https://picsum.photos/300",
      images: ["https://picsum.photos/300"],
      highlights: ["Premium", "Best Seller"],
      tags: [],
      isActive: true,
      createdBy: pick(users)._id,
    });
  }

  const savedProducts = await Product.insertMany(products);

  console.log("Creating orders...");

const startDate = new Date(2025, 0, 1); // Jan 1, 2025
const endDate = new Date(); // Today

for (
  let currentDate = new Date(startDate);
  currentDate <= endDate;
  currentDate.setDate(currentDate.getDate() + 1)
) {
  // Random number of orders for this day
  const ordersToday = random(2, 10);

  for (let i = 0; i < ordersToday; i++) {
    const user = pick(users);

    const itemCount = random(1, 4);
    const items = [];
    let total = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = pick(savedProducts);

      const qty = random(1, 3);

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

    // Random time during the day
    const createdAt = new Date(currentDate);
    createdAt.setHours(
      random(9, 22),
      random(0, 59),
      random(0, 59),
      0
    );

    const order = new Order({
      user: user._id,
      items,
      totalAmount: total,
      paymentStatus: pick(paymentStatuses),
      orderStatus: pick(orderStatuses),
      shippingAddress: {
        fullName: "Dummy Customer",
        phone: "9999999999",
        addressLine1: "Street 1",
        addressLine2: "",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
      createdAt,
      updatedAt: createdAt,
    });

    await order.save();
  }
}

  console.log("Updating products...");

  for (const product of savedProducts) {
    await product.save();
  }

  console.log("Done!");

  process.exit();
}

seed();