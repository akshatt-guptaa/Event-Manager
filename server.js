require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ===== Environment =====
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ===== MongoDB =====
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Models =====
const Event = require("./models/event");
const Registration = require("./models/registration");

// ===== ROUTES =====

// Homepage - show all events
app.get("/", async (req, res) => {
  const events = await Event.find();
  res.render("index", { events });
});

// Register page for a specific event
app.get("/register/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("register", { event });
});

// Handle registration form submission
app.post("/register/:id", async (req, res) => {
  const { name, email } = req.body;
  const eventId = req.params.id;
  await Registration.create({ name, email, eventId });
  res.redirect("/");
});

// ===== Admin Routes =====

// Admin dashboard
app.get("/admin", async (req, res) => {
  const events = await Event.find();
  res.render("admin", { events });
});

// Add event page
app.get("/add", (req, res) => {
  res.render("add", { event: null });
});

// Add event (POST)
app.post("/add", async (req, res) => {
  const { title, description, date, image } = req.body;
  await Event.create({ title, description, date, image });
  res.redirect("/admin");
});

// Edit event page
app.get("/edit/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("add", { event });
});

// Edit event (POST)
app.post("/edit/:id", async (req, res) => {
  const { title, description, date, image } = req.body;
  await Event.findByIdAndUpdate(req.params.id, { title, description, date, image });
  res.redirect("/admin");
});

// Delete event
app.get("/delete/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

// ===== Server =====
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
