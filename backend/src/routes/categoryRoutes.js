const express = require("express");
const router = express.Router();
const isAdmin= require('../middlewares/isAdmin')
const protect = require('../middlewares/protect')
const upload= require('../middlewares/upload')

const {
    createCategory,
    getCategories,
    updateCategory,
    toggleCategoryStatus,
} = require("../controllers/categoryController");


router.post(
    "/",
    protect,
    isAdmin,
    upload.single("image"),
    createCategory
);

router.get("/", getCategories);

router.patch(
    "/:id",
    protect,
    isAdmin,
    upload.single("image"),
    updateCategory
);



module.exports = router;