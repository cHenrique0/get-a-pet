require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Access denied!" });
  }

  const token = getToken(req);
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Access denied!" });
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedToken;
    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid token!" });
  }
};

module.exports = checkToken;
