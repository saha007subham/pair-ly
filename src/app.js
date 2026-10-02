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
