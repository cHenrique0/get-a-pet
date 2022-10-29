const { StatusCodes } = require("http-status-codes");
const { message } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

class UserController {
  static async register(req, res, next) {
    const {
      firstname,
      lastname,
      email,
      password,
      phone,
      picture,
      confirmPassword,
    } = req.body;

    // Validations for null input values
    if (!firstname || !lastname) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(message("The firstname or lastname can't be empty"));
    }
    if (!email) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(message("The email can't be empty"));
    }
    if (!phone) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(message("The phone can't be empty"));
    }
    if (!password || !confirmPassword) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(message("The password or confirm password can't be empty"));
    }

    if (password !== confirmPassword) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(message("Passwords don't match"));
    }

    // Check if the user email already exists
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(message("Email already registered. Please, choosen another."));
    }

    // Encrypting the password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: passwordHash,
      phone,
      picture,
    });

    await newUser
      .save()
      .then((user) => {
        return res
          .status(StatusCodes.CREATED)
          .json(message("User registered successfully!", user));
      })
      .catch((err) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(message(err));
      });
  }
}

module.exports = UserController;
