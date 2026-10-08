const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status type!!!" });
      }

      const user = await User.findById(toUserId);
      //   console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not exists!!!" });
      }

      // Check if there is an existing connection request:
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already sent.." });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.send({
        message:
          status === "interested"
            ? `${req.user.firstName} is ${status} in ${user.firstName}`
            : `${req.user.firstName} ${status} ${user.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  },
);

module.exports = requestRouter;
