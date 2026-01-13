const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Progress = require('../models/Progress');
const isLoggedIn = require('../middleware/isLoggedIn');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const validateGroup = require('../middleware/validateGroup');
const validateGroupUpdate = require('../middleware/validateGroupUpdate');

// CREATE GROUP FORM
router.get('/groups/new', isLoggedIn, (req, res) => {
    res.render('./groups/NewGroupForm.ejs', { title: "Create Group" });
});

// CREATE GROUP
router.post('/groups', isLoggedIn, validateGroup, catchAsync(async (req, res) => {
    let inviteCode;
    let exists;
    
    do {
        inviteCode = crypto.randomBytes(4).toString('hex');
        exists = await Group.findOne({ inviteCode });
    } while (exists);

    const group = new Group({
        name: req.body.group.name,
        admin: req.session.userId, // string gets cast to ObjectId !
        members: [req.session.userId],
        inviteCode,
    }); 

    await group.save();
    res.redirect('/dashboard');
}));

// JOIN GROUP FROM
router.get('/groups/join', isLoggedIn, (req, res) => {
    res.render('./groups/GroupJoin.ejs', { title: "Join Group" });
});

// REQUEST TO JOIN
router.post('/groups/join', isLoggedIn, catchAsync(async (req, res) => {
    const { inviteCode } = req.body;
    const group = await Group.findOne({ inviteCode });

    if (!group) throw new AppError("Invalid invite code", 404);

    if (group.members.some(id => id.equals(req.session.userId)) || group.pendingRequests.some(id => id.equals(req.session.userId))) {
        throw new AppError("Already requested or member", 400);
    }

    group.pendingRequests.push(req.session.userId);
    await group.save();

    res.redirect('/dashboard');
}));

// EDIT GROUP FORM
router.get('/groups/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group) throw new AppError("Group not found", 404);

    if (!group.admin.equals(req.session.userId)) {
        throw new AppError("Not authorized", 403);
    }

    res.render('./groups/GroupEdit.ejs', { title: "Edit Group", group });
}));

// EDIT GROUP
router.post('/groups/:id', isLoggedIn, validateGroupUpdate, catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group) throw new AppError("Group not found", 404);

    if (!group.admin.equals(req.session.userId)) {
        throw new AppError("Not authorized", 403);
    }

    group.name = req.body.group.name;
    await group.save();

    res.redirect(`/groups/${group._id}`);
}));

// APPROVE REQUEST (ADMIN ONLY)
router.post('/groups/:id/approve/:userId', isLoggedIn, catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) throw new AppError("Group not found", 404);

    if (!group.admin.equals(req.session.userId)) {
        throw new AppError("Not authorized", 403);
    }

    group.pendingRequests.pull(req.params.userId);
    group.members.push(req.params.userId);

    await group.save();

    res.redirect(`/groups/${req.params.id}`);
}));

// REJECT REQUEST (ADMIN ONLY)
router.post('/groups/:id/reject/:userId', isLoggedIn, catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) throw new AppError("Group not found", 404);

    if (!group.admin.equals(req.session.userId)) {
        throw new AppError("Not authorized", 403);
    }

    group.pendingRequests.pull(req.params.userId);
    await group.save();

    res.redirect(`/groups/${req.params.id}`);
}));

// REMOVE MEMBER (ADMIN ONLY)
router.post('/groups/:id/remove/:userId', isLoggedIn, catchAsync(async (req, res) => {
    const { id: groupId, userId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) throw new AppError("Group not found", 404);

    // Admin Check
    if (!group.admin.equals(req.session.userId)) {
        throw new AppError("Not authorized", 403);
    }

    // Prevent admin removing himself
    if (group.admin.equals(userId)) {
      throw new AppError("Admin cannot be removed", 400);
    }

    group.members.pull(userId);
    await group.save();

    // Cascade Delete Progress
    await Progress.deleteMany({ user: userId, group: groupId});

    res.redirect(`/groups/${groupId}`);
}));

module.exports = router;