const express = require("express");
const cors = require("cors")
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()
const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const statisticsRoutes = require('./routes/statisticsRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
//middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

//routes
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/statistics",statisticsRoutes)
app.use("/api/categories",categoryRoutes)
module.exports = app;