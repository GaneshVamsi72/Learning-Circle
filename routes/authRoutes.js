const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { validateRegister, validateLogin } = require('../middleware/validateUser');
/*
express.Router() in Express.js is a built-in function that creates a modular, mountable route handler.
It works like a mini Express application, allowing you to define routes and middleware separately, then attach them to your main app.
Key Points
-> Purpose: Organize routes into separate files/modules for cleaner code.
-> Features:
    1. Can handle its own middleware.
    2. Can define routes for specific URL paths.
    3. Can be mounted in the main app with a path prefix.
*/

// Prevent logged-in users from accessing auth pages
const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.userId) return res.redirect('/dashboard');
  next();
};

// REGISTER FORM
router.get('/register', redirectIfLoggedIn, (req, res) => {
    res.render('./auth/RegisterForm.ejs', { title: "Register" });
});

// REGISTER LOGIC
router.post('/register', validateRegister, catchAsync(async (req, res) => {
    const user = req.body.user;

    const existingUser = await User.findOne({ $or: [ { username: user.username }, { email: user.email } ] });
    if (existingUser) throw new AppError("User already exists", 400);

    const hashedPassword = await bcrypt.hash(user.password, 12);

    user.password = hashedPassword;

    const newUser = new User(user);
    await newUser.save();

    req.session.userId = newUser._id; // _id -> ObjectId....Becomes string due to serialization by express-session
    res.redirect('/dashboard');
}));

// LOGIN FORM
router.get('/login', redirectIfLoggedIn, (req, res) => {
    res.render('./auth/LoginForm.ejs', { title: "Login" });
});

// LOGIN LOGIC
router.post('/login', validateLogin, catchAsync(async (req, res) => {
    const cred = req.body.user;

    const user = await User.findOne({ username: cred.username });
    if (!user) throw new AppError("Invalid credentials", 401);

    const isValid = await bcrypt.compare(cred.password, user.password);
    if (!isValid) throw new AppError("Invalid credentials", 401);

    req.session.userId = user._id;
    res.redirect('/dashboard');
}));

// LOGOUT
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;