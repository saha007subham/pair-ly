const express = require("express");
const { adminAuth } = require("./middlewares/auth.middleware");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent....");
});

app.get("/admin/deleteAllData", (req, res) => {
  res.send("Deleted user data...");
});

app.listen(3000, () =>
  console.log("Server is successfully running on PORT 3000"),
);
