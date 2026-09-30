const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello from the server - Namaste Node");
});

app.listen(3000, () =>
  console.log("Server is successfully running on PORT 3000"),
);
