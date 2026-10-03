const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 26,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 60,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data not valid.");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://ui-avatars.com/api/?name=Subham+Saha&background=6366f1&color=fff&size=128",
    },
    about: {
      type: String,
      default: "This is the default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
