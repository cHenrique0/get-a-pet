const { Router } = require("express");
const UserController = require("../controllers/UserController");
const checkToken = require("../helpers/verify-token");

const userRouter = Router();

userRouter.post("/signup", UserController.signup);
userRouter.post("/login", UserController.login);
userRouter.get("/checkuser", UserController.checkUser);
userRouter.get("/:id", UserController.getUserById);
userRouter.patch("/edit/:id", checkToken, UserController.editUser);

module.exports = userRouter;
