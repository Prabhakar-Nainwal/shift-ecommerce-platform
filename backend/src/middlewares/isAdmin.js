const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require('dotenv').config()

const isAdmin = async (req, res, next) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized"
        });
    }
}
module.exports = isAdmin;