const express = require("express");
const mysql = require("./mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

router.get("/", (req, res) => {
  try {
    console.log(req.session);
    res.render("home.ejs", { isLogined: req.session.email });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
