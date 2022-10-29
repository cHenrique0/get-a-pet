const { Router } = require("express");
const UserController = require("../controllers/UserController");

const userRouter = Router();

userRouter.post("/signup", UserController.signup);
userRouter.post("/login", UserController.login);

module.exports = userRouter;
