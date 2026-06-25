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
        fullName:  String ,
        phone:  String ,
        addressLine1:  String ,
        addressLine2: String,
        city:  String ,
        state:  String,
        pincode:  String,
        country:String,
        isDefault:Boolean 
    }]
},
    {
        timestamps: true
    })


module.exports = mongoose.model("User", userSchema)