const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
        },
        purpose: {
            type: String,
            enum: ["register", "forgot-password", "change-password"],
            required: true
        },

        newPassword: {
            type: String
        },
        otp: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
    },
    {
        timestamps: true
    }
)

otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);
module.exports = mongoose.model("Otp", otpSchema)