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
            success: true,
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
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({
            success: true,
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getAddresses = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("addresses");

        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateAddresses = async (req, res) => {
    try {
        const { addresses } = req.body;

        if (!Array.isArray(addresses))
            return res.status(400).json({
                message: "Addresses are required."
            });

        const defaultCount = addresses.filter(address => address.isDefault).length;

        if (defaultCount > 1)
            return res.status(400).json({
                message: "Only one default address is allowed."
            });

        if (addresses.length && defaultCount === 0)
            addresses[0].isDefault = true;

        if (addresses.length > 6) {
            return res.status(400).json({
                success: false,
                message: "You can save a maximum of 6 addresses."
            });
        }

        const user = await userModel.findById(req.user._id);

        user.addresses = addresses;

        await user.save();

        res.json(user.addresses);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = { addUser, getUsers, getUser, updateUser, deleteUser, getProfile, updateAddresses, getAddresses }