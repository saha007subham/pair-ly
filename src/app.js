const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.middleware");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ userDetails: user });
  } catch (err) {
    res.status(400).send("Profile not found!!");
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
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

connectDB()
  .then(() => {
    console.log("Database connection establised...");

    app.listen(3000, () =>
      console.log("Server is successfully running on PORT 3000"),
    );
  })
  .catch((err) => {
    console.log("Failed to connect Database..");
  });
