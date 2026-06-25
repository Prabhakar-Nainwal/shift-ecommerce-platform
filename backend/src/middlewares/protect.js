const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require('dotenv').config()

const protect = async (req, res, next) => {
    try {  
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "unauthorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}
module.exports = protect;