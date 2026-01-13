const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const isLoggedIn = require("../middleware/isLoggedIn");
const catchAsync = require("../utils/catchAsync");

router.get("/dashboard", isLoggedIn, catchAsync(async (req, res) => {
    const groups = await Group.find({ members: req.session.userId });

    res.render("dashboard/index", { title: "Dashboard", groups });
}));

module.exports = router;