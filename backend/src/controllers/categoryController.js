const Category = require("../models/categoryModel");
const uploadFile = require("../services/storageServices");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }
    const image = await uploadFile(req.file,"Project_Urban_Shop/categories/");
    const category = await Category.create({ name, image });
    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    if (name) {
      const exists = await Category.findOne({
        _id: { $ne: category._id },
        name: { $regex: `^${name}$`, $options: "i" }
      });
      if (exists) {
        return res.status(400).json({ success: false, message: "Category already exists" });
      }
      category.name = name;
    }
    if (isActive !== undefined) {
      category.isActive = isActive === "true";
    }
    if (req.file) {
      category.image = await uploadFile(req.file,"Project_Urban_Shop/categories/");
    }
    await category.save();
    res.status(200).json({
      success: true,
      data: category,
      message: "Category updated successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory
};