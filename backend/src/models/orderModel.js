const mongoose = require("mongoose");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema(
    {
        orderId: { type: String, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            image: String,
            price: { type: Number, required: true },
            quantity: { type: Number, required: true, min: 1 }
        }],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, default: "India" }
        },
        totalAmount: { type: Number, required: true },
        paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
        orderStatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Out For Delivery", "Delivered", "Cancelled"], default: "Pending" }
    },
    { timestamps: true }
);

orderSchema.pre("save", async function () {
  if (!this.orderId) {
    let exists = true;

    while (exists) {
      const uniqueString = crypto.randomBytes(6).toString("hex").toUpperCase();
      const orderId = `ORD-${new Date().getFullYear()}-${uniqueString}`;

      exists = await mongoose.models.Order.exists({ orderId });

      if (!exists) {
        this.orderId = orderId;
      }
    }
  }
});

module.exports = mongoose.model("Order", orderSchema);