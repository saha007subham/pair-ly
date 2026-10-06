const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware");

const profileRoute = express.Router();

profileRoute.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ userDetails: user });
  } catch (err) {
    res.status(400).send("Profile not found!!");
  }
});

module.exports = profileRoute;
