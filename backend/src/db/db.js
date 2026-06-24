const mongoose = require('mongoose')
require('dotenv').config();

const connectDB =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB CONNECTED SUCCESSFULLY ✅✅✅")
    } catch (error) {
        console.error()
    }
    
}

module.exports = connectDB;