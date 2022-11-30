const express = require("express");
const userControlers = require("../../models/user");
const { tryCatchWrapper } = require("../../helpers/index");
const { userMiddlewares } = require("../../middleweras/userMiddlewares");
const { upload } = require('../../middleweras/uploadAvatars');
const userRouter = express.Router();


userRouter.post("/register", tryCatchWrapper(userControlers.register));
userRouter.post("/login", tryCatchWrapper(userControlers.login));
userRouter.post("/logout", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.logout));
userRouter.get("/current", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.current));
userRouter.patch("/avatars",  tryCatchWrapper(userMiddlewares),upload.single("image"), tryCatchWrapper(userControlers.avatars));
userRouter.get("/verify/:token", tryCatchWrapper(userControlers.verify));
userRouter.post("/verify", tryCatchWrapper(userControlers.ROSTverify));

module.exports = {
  userRouter,
};
