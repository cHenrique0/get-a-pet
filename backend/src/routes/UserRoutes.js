const { Router } = require("express");
const UserController = require("../controllers/UserController");

const userRouter = Router();

userRouter.post("/signup", UserController.signup);

module.exports = userRouter;
