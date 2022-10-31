require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUserByToken = async (token, res) => {
  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).json({ msg: "Access denied!" });
  }

  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);

  return await User.findById(decodedToken.id)
    .then((user) => user)
    .catch((err) =>
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.name, error: err.message })
    );
};

module.exports = getUserByToken;
