const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devSubham07:u5OTE6vy94quIwfI@cluster0.8eltigl.mongodb.net/pair-ly",
  );
};

module.exports = connectDB;
