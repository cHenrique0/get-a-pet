const { Router } = require("express");
const UserController = require("../controllers/UserController");

const userRouter = Router();

userRouter.post("/register", UserController.register);

module.exports = userRouter;
