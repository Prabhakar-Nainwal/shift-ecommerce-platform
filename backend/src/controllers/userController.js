const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const otpModel = require('../models/otpModel')
const {generateOtp,getOtpHtml} = require('../utils/utils')
const {sendEmail} = require('../services/emailService')

const addUser = async (req, res) => {
  try {
    const admin = await userModel.findById(req.user._id);
    const ok = await bcrypt.compare(req.body.adminPassword, admin.password);
    if (!ok) return res.status(401).json({ message: "Invalid admin password" });
    const {password} = req.body
    const hash = await bcrypt.hash(password,10)
    const user = await userModel.create({...req.body, password:hash});
    res.status(201).json({ success: true, message: "successfull", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ success: true, message: "successfull", data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).json({ success: true, message: "successfull", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("addresses");
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAddresses = async (req, res) => {
  try {
    const { addresses } = req.body;
    if (!Array.isArray(addresses)) return res.status(400).json({ message: "Addresses are required." });
    const defaultCount = addresses.filter(address => address.isDefault).length;
    if (defaultCount > 1) return res.status(400).json({ message: "Only one default address is allowed." });
    if (addresses.length && defaultCount === 0) addresses[0].isDefault = true;
    if (addresses.length > 6) {
      return res.status(400).json({ success: false, message: "You can save a maximum of 6 addresses." });
    }
    const user = await userModel.findById(req.user._id);
    user.addresses = addresses;
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await userModel.findById(req.user._id);

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different"
            });
        }

        // Delete previous request
        await otpModel.findOneAndDelete({
            email: user.email,
            purpose: "change-password"
        });

        const otp = generateOtp();

        const hashedOtp = await bcrypt.hash(otp, 10);

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await otpModel.create({
            email: user.email,
            otp: hashedOtp,
            newPassword: hashedPassword,
            purpose: "change-password",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        await sendEmail({
            to: user.email,
            subject: "Change Password OTP",
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
const verifyChangePasswordOtp = async (req, res) => {

    try {

        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            });
        }

        const otpData = await otpModel.findOne({
            email: req.user.email,
            purpose: "change-password"
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

        await userModel.findByIdAndUpdate(
            req.user._id,
            {
                password: otpData.newPassword
            }
        );

        await otpData.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
module.exports = { changePassword, verifyChangePasswordOtp,addUser, getUsers, getUser, updateUser, deleteUser, getProfile, updateAddresses, getAddresses };