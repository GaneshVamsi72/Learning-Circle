const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Group = require('../models/Group');
const isLoggedIn = require('../middleware/isLoggedIn');
const validateProgress = require('../middleware/validateProgress');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// GROUP DETAIL PAGE
router.get('/groups/:groupId', isLoggedIn, catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.groupId)
        .populate("members", "username")
        .populate("pendingRequests", "username");

    if (!group) throw new AppError("Group not found", 404);

    if (!group.members.some(id => id.equals(req.session.userId))) {
        throw new AppError("Not authorized", 403);
    }

    const groupProgress = await Progress.find({ group: group._id })
        .populate("user", "username");

    const isAdmin = group.admin.equals(req.session.userId);

    res.render("./groups/GroupDetail.ejs", { title: group.name, group, groupProgress, isAdmin});
}));

// ADD LEARNING TRACK FORM
router.get("/groups/:groupId/progress/new", isLoggedIn, catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.groupId);
    if (!group) throw new AppError("Group not found", 404);

    if (!group.members.some(id => id.equals(req.session.userId))) {
      throw new AppError("Not authorized", 403);
    }

    res.render("./progress/AddForm.ejs", { title: "Add Progress", group});
}));

// ADD LEARNING TRACK
router.post('/groups/:groupId/progress', isLoggedIn, validateProgress,  catchAsync(async (req, res) => {
    const progress = req.body.progress;

    const group = await Group.findById(req.params.groupId);
    if (!group) throw new AppError("Group not found", 404);

    if (!group.members.some(id => id.equals(req.session.userId))) {
        throw new AppError('Not a group member', 403);
    }

    if (progress.totalUnits < progress.completedUnits) throw new AppError("Completed units exceed total", 400);

    progress.user = req.session.userId;
    progress.group =  group._id;

    const newProgress = new Progress(progress);
    await newProgress.save();

    res.redirect(`/groups/${req.params.groupId}`);
}));

// UPDATE PROGRESS FORM
router.get("/groups/:groupId/progress/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const progress = await Progress.findById(req.params.id);
    if (!progress) throw new AppError("Progress not found", 404);

    if (!progress.user.equals(req.session.userId)) {
      throw new AppError("Not authorized", 403);
    }

    if (!progress.group.equals(req.params.groupId)) {
      throw new AppError("Invalid group", 400);
    }

    res.render("./progress/UpdateForm.ejs", { title: "Edit Progress", progress });
}));

// UPDATE PROGRESS
router.post('/groups/:groupId/progress/:id/update', isLoggedIn, validateProgress, catchAsync(async (req, res) => {
    const updateProgress = req.body.progress;

    const progress = await Progress.findById(req.params.id);
    if (!progress) throw new AppError("Progress not found", 404);

    if (!progress.user.equals(req.session.userId)) {
        throw new AppError("Not authorized", 403);
    }

    if (!progress.group.equals(req.params.groupId)) throw new AppError("Invalid group", 400);

    if (updateProgress.totalUnits < updateProgress.completedUnits) throw new AppError("Completed units exceed total", 400);
    
    updateProgress.lastUpdated = Date.now();

    let updated = await Progress.findByIdAndUpdate(req.params.id, updateProgress, { runValidators: true });
    if (!updated) throw new AppError("Progress not found", 404);

    res.redirect(`/groups/${req.params.groupId}`);
}));

module.exports = router;