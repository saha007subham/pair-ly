const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate data:
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password:
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send({ message: "User Signed-up Successfully!" });
  } catch (err) {
    console.log({ err });
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Email ID is not present in DB!");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = await jwt.sign({ _id: user._id }, "saha007subham@1997", {
        expiresIn: "1d",
      });

      res.cookie("token", token);
      res.send({ message: "Login Successfull!!!" });
    } else {
      throw new Error("Password is not correct.");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = authRouter;
