const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware");
const { validateEditData } = require("../utils/validation");

const profileRoute = express.Router();

profileRoute.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ userDetails: user });
  } catch (err) {
    res.status(400).send("Profile not found!!");
  }
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      return res
        .status(400)
        .send({ message: "Edit not alowed, please enter valid Data!!!" });
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.send({
      message: `${loggedInUser.firstName}, your profile is updated successfully..`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(404).send("Error : " + error.message);
  }
});

module.exports = profileRoute;
