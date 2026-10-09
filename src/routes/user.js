const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });

    res.json(connectionRequest);
  } catch (err) {
    res.status(400).json({ message: `Error : ${err.message}` });
  }
});

module.exports = userRouter;
