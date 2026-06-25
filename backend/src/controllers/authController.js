const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({ name, email, password: hash })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
        res.cookie("token", token)
        res.status(201).json({
            success: true,
            data: user,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "invalid details"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        user.lastLogin = new Date();
        await user.save()

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
        res.cookie("token", token)
        res.status(201).json({
            success: true,
            data: user,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }

}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "Log out"
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser }
// , forgotPassword, resetPassword, changePassword