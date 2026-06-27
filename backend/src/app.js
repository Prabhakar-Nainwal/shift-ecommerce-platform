const express = require("express");
const cors = require("cors")
const cookieParser = require('cookie-parser')

const app = express()
const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const statisticsRoutes = require('./routes/statisticsRoutes')
//middlewares
app.use(cors({
  origin: "http://localhost:5173",
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
module.exports = app;