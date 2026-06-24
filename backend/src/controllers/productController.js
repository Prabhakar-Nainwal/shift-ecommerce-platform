const productModel = require('../models/productModel')

const addProduct = async (req, res) => {
    try {
        const product = await productModel.create(req.body)
        res.status(201).json({
            success: true,
            message: "Added product",
            data: product,
        })

    } catch (error) {
        console.error(error)
        res.send(500).json({
            success: false,
            message: "failed to add product",
            error: error.message,
        })
    }
}

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
        const product = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!product) {
            res.status(404).json({
                success: false,
                message: "product not found",

            })
        }
        res.status(200).json({
            success: true,
            message: "data updated",
            data: product,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message,
        })
    }
}


module.exports = {
    addProduct, getProducts, getProduct, activateProduct,
    deactivateProduct, deleteProduct, updateProduct
}