const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const getSummary = async (req, res) => {
    try {
        const deliveredOrders = await Order.find({ orderStatus: "Delivered" });
        const revenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        const summary = {
            revenue,
            orders: deliveredOrders.length,
            products: await Product.countDocuments(),
            customers: await User.countDocuments({ role: "user" }),
        };

        res.status(200).json({ success: true, summary });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getStatistics = async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ success: false, message: "Start date and end date are required" });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        if (startDate > endDate) {
            return res.status(400).json({ success: false, message: "Invalid date range" });
        }

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        let groupBy = "";

        if (totalDays <= 14) groupBy = "day";
        else if (totalDays <= 30) groupBy = "2days";
        else if (totalDays <= 180) groupBy = "week";
        else if (totalDays <= 730) groupBy = "month";
        else groupBy = "year";

        const orderFilter = {
            orderStatus: "Delivered",
            createdAt: { $gte: startDate, $lte: endDate },
        };
        let revenueChart = [];

        if (groupBy === "day") {
            revenueChart = await Order.aggregate([
                { $match: orderFilter },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" },
                        },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
                {
                    $project: {

                        _id: 0,

                        label: {

                            $concat: [

                                { $toString: "$_id.day" },

                                " ",

                                {
                                    $arrayElemAt: [
                                        [
                                            "",
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "$_id.month"
                                    ]
                                }

                            ]

                        },

                        fullLabel: {

                            $concat: [

                                { $toString: "$_id.day" },

                                " ",

                                {
                                    $arrayElemAt: [
                                        [
                                            "",
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "$_id.month"
                                    ]
                                },

                                " ",

                                { $toString: "$_id.year" }

                            ]

                        },

                        revenue: 1

                    }
                },
            ]);
        } else if (groupBy === "2days") {
            revenueChart = await Order.aggregate([
                { $match: orderFilter },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            bucket: { $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 2] } },
                        },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.bucket": 1 } },
                {
                    $project: {

                        _id: 0,

                        label: {

                            $concat: [

                                {
                                    $toString: {
                                        $subtract: [
                                            {
                                                $multiply: ["$_id.bucket", 2]
                                            },
                                            1
                                        ]
                                    }
                                },

                                "-",

                                {
                                    $toString: {
                                        $multiply: ["$_id.bucket", 2]
                                    }
                                },

                                " ",

                                {
                                    $arrayElemAt: [
                                        [
                                            "",
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "$_id.month"
                                    ]
                                }

                            ]

                        },

                        fullLabel: {

                            $concat: [

                                {
                                    $toString: {
                                        $subtract: [
                                            {
                                                $multiply: ["$_id.bucket", 2]
                                            },
                                            1
                                        ]
                                    }
                                },

                                " ",

                                {
                                    $arrayElemAt: [
                                        [
                                            "",
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "$_id.month"
                                    ]
                                },

                                " ",

                                {
                                    $toString: "$_id.year"
                                },

                                " - ",

                                {
                                    $toString: {
                                        $multiply: ["$_id.bucket", 2]
                                    }
                                },

                                " ",

                                {
                                    $arrayElemAt: [
                                        [
                                            "",
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "$_id.month"
                                    ]
                                },

                                " ",

                                {
                                    $toString: "$_id.year"
                                }

                            ]

                        },

                        revenue: 1

                    }
                },
            ]);
        } else if (groupBy === "week") {
            revenueChart = await Order.aggregate([
                { $match: orderFilter },
                {
                    $group: {
                        _id: { year: { $isoWeekYear: "$createdAt" }, week: { $isoWeek: "$createdAt" } },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.week": 1 } },
                {
                    $project: {
                        _id: 0,

                        label: {
                            $dateToString: {
                                format: "%d %b",
                                date: {
                                    $dateFromParts: {
                                        isoWeekYear: "$_id.year",
                                        isoWeek: "$_id.week",
                                        isoDayOfWeek: 1
                                    }
                                }
                            }
                        },

                        fullLabel: {
                            $concat: [
                                {
                                    $dateToString: {
                                        format: "%d %B %Y",
                                        date: {
                                            $dateFromParts: {
                                                isoWeekYear: "$_id.year",
                                                isoWeek: "$_id.week",
                                                isoDayOfWeek: 1
                                            }
                                        }
                                    }
                                },
                                " - ",
                                {
                                    $dateToString: {
                                        format: "%d %B %Y",
                                        date: {
                                            $dateAdd: {
                                                startDate: {
                                                    $dateFromParts: {
                                                        isoWeekYear: "$_id.year",
                                                        isoWeek: "$_id.week",
                                                        isoDayOfWeek: 1
                                                    }
                                                },
                                                unit: "day",
                                                amount: 6
                                            }
                                        }
                                    }
                                }
                            ]
                        },

                        revenue: 1
                    }
                },
            ]);
        } else if (groupBy === "month") {
            revenueChart = await Order.aggregate([
                { $match: orderFilter },
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                {
                    $project: {

                        _id: 0,

                        label: {
                            $dateToString: {
                                format: "%b %Y",
                                date: {
                                    $dateFromParts: {
                                        year: "$_id.year",
                                        month: "$_id.month",
                                        day: 1
                                    }
                                }
                            }
                        },

                        fullLabel: {
                            $dateToString: {
                                format: "%B %Y",
                                date: {
                                    $dateFromParts: {
                                        year: "$_id.year",
                                        month: "$_id.month",
                                        day: 1
                                    }
                                }
                            }
                        },

                        revenue: 1

                    }
                },
            ]);
        } else {
            revenueChart = await Order.aggregate([
                { $match: orderFilter },
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" } },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { "_id.year": 1 } },
                {
                    $project: {
                        _id: 0,
                        label: { $toString: "$_id.year" },
                        revenue: 1,
                    },
                },
            ]);
        }

        const topProducts = await Order.aggregate([
            { $match: orderFilter },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    salesCount: { $sum: "$items.quantity" },
                },
            },
            { $sort: { salesCount: -1 } },
            { $limit: 5 },
            { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    product: "$product.name",
                    salesCount: 1,
                },
            },
        ]);

        const criticalProducts = await Product.find({ stock: { $lte: 5 } }, "name");
        const lowProducts = await Product.find({ stock: { $gte: 6, $lte: 20 } }, "name");
        const moderateProducts = await Product.find({ stock: { $gte: 21, $lte: 50 } }, "name");

        const lowStock = [
            { name: "Critical (≤5)", value: criticalProducts.length, products: criticalProducts.map(p => p.name) },
            { name: "Low (6–20)", value: lowProducts.length, products: lowProducts.map(p => p.name) },
            { name: "Moderate (21–50)", value: moderateProducts.length, products: moderateProducts.map(p => p.name) },
        ];

        res.status(200).json({ success: true, revenueChart, topProducts, lowStock });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getSummary, getStatistics };