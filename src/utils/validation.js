const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter a valid name!");
  }

  if (firstName.length < 2 || firstName.length > 26) {
    throw new Error("Firstname should be 2-26 characters!");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid Email.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEditData = (req) => {
  const allowedEdit = [
    "firstName",
    "lastName",
    "photoURL",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isAllowed = Object.keys(req.body).every((fields) =>
    allowedEdit.includes(fields),
  );

  return isAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditData,
};
