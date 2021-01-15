const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const compression = require("compression");
const cors = require("cors");
const db = require("./models");
dotenv.config();

const app = express();

db.sequelize.sync().then(() => {
  console.log("Connected to database");
});

app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json("12kb"));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/services", (req, res, next) => {
  res.render("services");
});
app.get("/blog", (req, res, next) => {
  res.render("blog");
});
app.get("/consultation", (req, res, next) => {
  res.render("consultation");
});

app.post("/api/v1/contacts", async (req, res, next) => {
  try {
    const contact = await db.Contact.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ err });
  }
});
app.get("/api/v1/contacts", async (req, res, next) => {
  const contacts = await db.Contact.findAll();
  res.json(contacts);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started succesfully on port ${port}`);
});
