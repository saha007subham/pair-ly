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
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoURL",
      "about",
      "age",
      "gender",
      "skills",
    ]);

    res.json(connectionRequest);
  } catch (err) {
    res.status(400).json({ message: `Error : ${err.message}` });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoURL",
        "about",
        "age",
        "gender",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoURL",
        "about",
        "age",
        "gender",
        "skills",
      ]);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return {
          toUserId: row.toUserId._id,
          firstName: row.toUserId.firstName,
          lastName: row.toUserId.lastName,
        };
      }

      return {
        toUserId: row.fromUserId._id,
        firstName: row.fromUserId.firstName,
        lastName: row.fromUserId.lastName,
      };
    });

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: `Error ${err.message}` });
  }
});

module.exports = userRouter;
