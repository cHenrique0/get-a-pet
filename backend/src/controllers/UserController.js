const { StatusCodes } = require("http-status-codes");
const { message } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createUserToken = require("../helpers/create-user-tokens");

class UserController {
  static async signup(req, res, next) {
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
        .json({ msg: "The firstname or lastname can't be empty" });
    }
    if (!email) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: "The email can't be empty" });
    }
    if (!phone) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: "The phone can't be empty" });
    }
    if (!password || !confirmPassword) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: "The password or confirm password can't be empty" });
    }

    if (password !== confirmPassword) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: "Passwords don't match" });
    }

    // Check if the user email already exists
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: "Email already registered. Please, choosen another." });
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
      .then(async (user) => {
        await createUserToken(user, req, res);
      })
      .catch((err) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
      });
  }
}

module.exports = UserController;
