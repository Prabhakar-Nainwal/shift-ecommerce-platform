const productModel = require('../models/productModel')
const uploadFile = require('../services/storageServices')

const addProduct = async (req, res) => {
    try {
        const coverImage = req.files?.coverImage ? await uploadFile(req.files.coverImage[0]) : "";
        const images = req.files?.images ? await Promise.all(req.files.images.map(uploadFile)) : [];
        const product = await productModel.create({
            ...req.body,
            tags: JSON.parse(req.body.tags || "[]"),
            highlights: JSON.parse(req.body.highlights || "[]"),
            coverImage,
            images,
        });
        res.status(201).json({
            success: true,
            message: "Added product",
            data: product,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "failed to add product",
            error: error.message,
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find()
        res.status(200).json({
            success: true,
            data: products,
            message: "Request Successfull"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "req failed",
            error: error.message,
        })
    }
}

const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        res.status(200).json({
            success: true,
            message: "request successfull",
            data: product,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message,
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await productModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Request Successfull",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message,
        })
    }
}

const deactivateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
        if (!product) {
            res.status(404).json({
                success: false,
                message: "product not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "Request successfull",
            data: product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message,
        })
    }
}

const activateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true })
        if (!product) {
            res.status(404).json({
                success: false,
                message: "product not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "Request successfull",
            data: product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message,
        })
    }
}
const updateProduct = async (req, res) => {
    try {

        const oldProduct = await productModel.findById(req.params.id);

        if (!oldProduct) {
            return res.status(404).json({
                success: false,
                message: "product not found",
            });
        }

        const coverImage = req.files?.coverImage
            ? await uploadFile(req.files.coverImage[0])
            : oldProduct.coverImage;

        const images = req.files?.images
            ? await Promise.all(req.files.images.map(uploadFile))
            : oldProduct.images;

        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                tags: JSON.parse(req.body.tags || "[]"),
                highlights: JSON.parse(req.body.highlights || "[]"),
                coverImage,
                images,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "data updated",
            data: product,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message,
        });
    }
};

module.exports = {
    addProduct, getProducts, getProduct, activateProduct,
    deactivateProduct, deleteProduct, updateProduct
}