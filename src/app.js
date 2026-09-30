const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    firstName: "Subham",
    lastName: "Saha",
    role: "Full Stack Developer",
  });
});

app.post("/user", (req, res) => {
  res.send({ message: "User data successfully saved to the database" });
});

app.use((req, res) => {
  res.send("Hello from the server - Namaste Node");
});

app.listen(3000, () =>
  console.log("Server is successfully running on PORT 3000"),
);
