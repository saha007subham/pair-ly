const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send({ message: "User Signed-up Successfully!" });
  } catch (err) {
    res.status(400).send("Error signing-up User...");
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
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, data);
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
