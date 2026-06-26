const userModel = require('../models/userModel')
const addUser = async (req, res) => {
    try {
        const user = await userModel.create(req.body);
        res.status(201).json({
            success: true,
            message: "successfull",
            data: user

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            success: true,
            message: "successfull",
            data: users

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "successfull",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success:true,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json({
            success:true,
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



module.exports = {addUser, getUsers, getUser, updateUser, deleteUser, getProfile}