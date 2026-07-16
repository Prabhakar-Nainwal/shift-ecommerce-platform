
const productModel = require("../models/productModel");
const uploadFile = require("../services/storageServices");
const Category = require("../models/categoryModel");

const addProduct = async (req, res) => {
  try {
    const coverImage = req.files?.coverImage ? await uploadFile(req.files.coverImage[0], "Project_Urban_Shop/products/covers/") : "";
    const images = req.files?.images ? await Promise.all(req.files.images.map(file => uploadFile(file, "Project_Urban_Shop/products/images/"))) : [];
    const categoryExists = await Category.findOne({ _id: req.body.category, isActive: true });
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    const mrp = Number(req.body.mrp) || 0;
    const price = Number(req.body.price) || 0;
    const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const product = await productModel.create({
      ...req.body,
      tags: JSON.parse(req.body.tags || "[]"),
      highlights: JSON.parse(req.body.highlights || "[]"),
      coverImage,
      images,
      discount,
    });
    res.status(201).json({ success: true, message: "Added product", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "failed to add product", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const products = await productModel
      .find(filter)
      .populate("category", "name")
      .skip(skip)
      .limit(Number(limit));
    const totalProducts = await productModel.countDocuments(filter);
    res.status(200).json({
      success: true,
      data: products,
      totalProducts,
      hasMore: skip + products.length < totalProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "req failed", error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).populate("category", "name");
    res.status(200).json({ success: true, message: "request successfull", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Request Successfull" });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error", error: error.message });
  }
};

const deactivateProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(req.params.id, { isActive: false }, { returnDocument: 'after' });
    if (!product) {
      return res.status(404).json({ success: false, message: "product not found" });
    }
    res.status(200).json({ success: true, message: "Request successfull", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error", error: error.message });
  }
};

const activateProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(req.params.id, { isActive: true }, { returnDocument: 'after' });
    if (!product) {
      return res.status(404).json({ success: false, message: "product not found" });
    }
    res.status(200).json({ success: true, message: "Request successfull", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const oldProduct = await productModel.findById(req.params.id);
    if (!oldProduct) {
      return res.status(404).json({ success: false, message: "product not found" });
    }
    const coverImage = req.files?.coverImage ? await uploadFile(req.files.coverImage[0], "Project_Urban_Shop/products/covers/") : oldProduct.coverImage;
    const images = req.files?.images ? await Promise.all(req.files.images.map(file => uploadFile(file, "Project_Urban_Shop/products/images/"))) : oldProduct.images;
    if (req.body.category) {
      const categoryExists = await Category.findOne({ _id: req.body.category, isActive: true });
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
    }
    const mrp = req.body.mrp !== undefined ? Number(req.body.mrp) : oldProduct.mrp;
    const price = req.body.price !== undefined ? Number(req.body.price) : oldProduct.price;
    const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        tags: JSON.parse(req.body.tags || "[]"),
        highlights: JSON.parse(req.body.highlights || "[]"),
        coverImage,
        images,
        discount
      },
      { returnDocument: 'after' }
    );
    res.status(200).json({ success: true, message: "data updated", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server error", error: error.message });
  }
};

const getNewProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 }).limit(8)
    res.status(200).json({ success: true, data: products, })

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message })
  }
}

const getBestDeals = async (req, res) => {
  try {
    const products = await productModel.find().sort({ discount: -1 }).limit(8)
    res.status(200).json({ success: true, data: products })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message })
  }
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  activateProduct,
  deactivateProduct,
  deleteProduct,
  updateProduct,
  getNewProducts,
  getBestDeals
};

