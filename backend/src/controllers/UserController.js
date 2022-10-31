const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createUserToken = require("../helpers/create-user-tokens");
const getToken = require("../helpers/get-token");

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

  static async login(req, res, next) {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: "Email or password can't be empty" });
    }

    // Check if user exists
    await User.findOne({ email: email })
      .then(async (userFound) => {
        if (!userFound) {
          return res.status(StatusCodes.NOT_FOUND).json({
            msg: "User not found! User email maybe incorrect.",
            data: { user: userFound },
          });
        }

        // Check if password match
        await bcrypt
          .compare(password, userFound.password)
          .then((match) => {
            if (!match) {
              return res
                .status(StatusCodes.NOT_FOUND)
                .json({ msg: "Invalid password. Try again." });
            }

            return createUserToken(userFound, req, res);
          })
          .catch((err) => {
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ msg: err.name, error: err.message });
          });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: err.name, error: err.message });
      });
  }

  static async checkUser(req, res, next) {
    let currentUser = undefined;
    const { authorization } = req.headers;

    if (!authorization) {
      currentUser = null;
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "User not found", data: { user: currentUser } });
    }

    const token = getToken(req);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // .select("-password") -> return the user object without password
    currentUser = await User.findById(decodedToken.id).select("-password");

    return res
      .status(StatusCodes.OK)
      .json({ msg: "", data: { user: currentUser } });
  }

  static getUserById = async (req, res, next) => {
    const { id } = req.params;

    await User.findById(id)
      .select("-password")
      .then((user) => {
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "User not found", data: { user } });
        }

        return res.status(StatusCodes.OK).json({ data: { user } });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: err.name, error: err.message });
      });
  };
}

module.exports = UserController;
