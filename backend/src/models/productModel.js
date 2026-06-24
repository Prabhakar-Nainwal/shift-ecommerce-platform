const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, },
        description: { type: String, required: true, },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, default: 0, min: 0 },
        category: {
            type: String, required: true, index: true, enum: ["Toys", "Accessories", "Decoration", "Electronics", "Books", "Beauty", "Sports", "others"]
        },
        brand: { type: String, default: "", },
        coverImage: String,
        salesCount: { type: Number, default: 0, min: 0 },
        tags: [{
            type: String, enum: ["Fitness", "Health", "Gaming", "Wireless", "Smart", "Portable", "Eco-Friendly", "Organic", "Professional", "Casual", "Outdoor", "Indoor", "Luxury", "Educational", "Kids", "Men", "Women", "Travel", "Wearable"] }],
        images: [String],
        rating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0, min: 0 },
        discountPercentage: { type: Number, default: 0, },
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