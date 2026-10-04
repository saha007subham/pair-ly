const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
      const token = await jwt.sign({ _id: user._id }, "saha007subham@1997");

      res.cookie("token", token);
      res.send({ message: "Login Successfull!!!" });
    } else {
      throw new Error("Password is not correct.");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;

  if (!token) {
    res.status(401).send({ message: "Please login again!!!" });
  }

  const jwtResponse = await jwt.verify(token, "saha007subham@1997");

  const { _id } = jwtResponse;

  //   console.log("Logged in user id is : " + _id);

  const user = await User.findById(_id);

  try {
    res.send({ userDetails: user });
  } catch (err) {
    res.status(400).send("Profile not found!!");
  }
});

// Get user by email:
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });

    if (user.length === 0) {
      res.status(404).send({ message: "User not found." });
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log("Something went wrong.");
  }
});

// Get all users:
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send({ count: allUsers.length, users: allUsers });
  } catch (err) {
    console.log("Something went wrong.");
  }
});

// Delete a user:
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send({ message: "User Deleted Successfully." });
  } catch (err) {
    console.log("Something went wrong.");
  }
});

// Update the user:
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed...");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send({ message: `User data of ${user.firstName} is updated.` });
  } catch (err) {
    console.log("Something went wrong.");
  }
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
