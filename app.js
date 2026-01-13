require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const progressRoutes = require('./routes/progressRoutes');

const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const timeTaken = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${timeTaken}ms`);
  });

  res.locals.currentUser = req.session.userId || null;
  next();
});

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("MainPage.ejs");
});

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', groupRoutes);
app.use('/', progressRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`, 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render('ErrorPage.ejs', { title: "Error", message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});