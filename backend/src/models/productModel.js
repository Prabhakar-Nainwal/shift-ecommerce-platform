const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, },
        description: { type: String, required: true, },
        price: { type: Number, required: true, min: 0 },
        mrp: {
            type: Number, required: true, min: 0, validate: {
                validator(value) { return value >= this.price; }, message: "MRP must be greater than or equal to price."
            }
        },
        discount: { type: Number, default: 0},
        stock: { type: Number, required: true, default: 0, min: 0 },
        category: {
            type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true
        },
        coverImage: String,
        salesCount: { type: Number, default: 0, min: 0 },
        tags: [{
            type: String, enum: ["Fitness", "Health", "Gaming", "Wireless", "Smart", "Portable", "Eco-Friendly", "Organic", "Professional", "Casual", "Outdoor", "Indoor", "Luxury", "Educational", "Kids", "Men", "Women", "Travel", "Wearable"]
        }],
        images: [String],
        highlights: [String],
        rating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0, min: 0 },
        isActive: { type: Boolean, default: true, },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);