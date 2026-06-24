const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true},
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: String,
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    addresses: [{
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false }
    }]
},
    {
        timestamps: true
    })


module.exports = mongoose.model("User", userSchema)