const express = require('express')
const router = express.Router()
const protect = require('../middlewares/protect')
const isAdmin = require('../middlewares/isAdmin')
const {getSummary, getStatistics} = require('../controllers/statisticsController')

router.get("/", protect, isAdmin, getStatistics);
router.get("/summary", protect, isAdmin, getSummary);

module.exports = router;