require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  // Create a token
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET
  );

  return res.status(StatusCodes.OK).json({
    message: "Authenticated user",
    token,
    data: {
      user: {
        id: user._id,
        email: user.email,
      },
    },
  });
};

module.exports = createUserToken;
