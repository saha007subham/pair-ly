const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";

  if (!isAuthorized) {
    res.status(401).send({ message: "Un-authorized Request" });
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
