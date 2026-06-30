const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const otpModel = require("../models/otpModel");
const { generateOtp, getOtpHtml } = require("../utils/utils");
const { sendEmail } = require("../services/emailService");


require('dotenv').config()

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        await otpModel.findOneAndDelete({ email });
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Save temporary user
        await otpModel.create({
            name,
            email,
            password: hashedPassword,
            otp: hashedOtp,
            purpose:"register",
            expiresAt
        });

        await sendEmail({
            to: email,
            subject: "Verify Your Email",
            html: getOtpHtml(otp)
        });
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET,{ expiresIn: "7d" })
        res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
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
        res.clearCookie("token",{httpOnly:true,})
        res.status(200).json({
            success: true,
            message: "You logged Out"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            await pendingUser.deleteOne();

            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }
        const pendingUser = await otpModel.findOne({ email });
        if (!pendingUser) {
            return res.status(404).json({
                success: false,
                message: "OTP not found. Please register again."
            });
        }

        if (pendingUser.expiresAt < new Date()) {
            await otpModel.findOneAndDelete({ email });

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please register again."
            });
        }
        const isMatch = await bcrypt.compare(otp, pendingUser.otp);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        const user = await userModel.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password
        });

        await pendingUser.deleteOne();
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "Email verified successfully.",
            data: user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Remove previous forgot-password request
        await otpModel.findOneAndDelete({
            email,
            purpose: "forgot-password"
        });

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        await otpModel.create({
            email,
            otp: hashedOtp,
            purpose: "forgot-password",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            html: getOtpHtml(otp)
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const verifyForgotPasswordOtp = async (req, res) => {
    try {

        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const otpData = await otpModel.findOne({
            email,
            purpose: "forgot-password"
        });

        if (!otpData) {
            return res.status(404).json({
                success: false,
                message: "OTP not found"
            });
        }

        if (otpData.expiresAt < new Date()) {

            await otpData.deleteOne();

            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        const isMatch = await bcrypt.compare(
            otp,
            otpData.otp
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await userModel.findOneAndUpdate(
            { email },
            {
                password: hashedPassword
            }
        );

        await otpData.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    registerUser, loginUser, logoutUser, verifyOtp, forgotPassword,
    verifyForgotPasswordOtp,
}
// , forgotPassword, resetPassword, changePassword