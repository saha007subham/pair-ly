const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  console.log("Sending a connection request..." + user);

  res.send({
    message:
      user.firstName +
      " " +
      user.lastName +
      " " +
      "sent the Connection Request.",
  });
});

module.exports = requestRouter;
