const express = require("express");
const userControlers = require("../../models/user");
const { tryCatchWrapper } = require("../../helpers/index");
const { userMiddlewares } = require("../../middleweras/userMiddlewares");
const { upload } = require('../../middleweras/uploadAvatars');
const { validation } = require("../../middleweras/validation");
const userRouter = express.Router();
const {
  userSchemaJoi,
    verifyEmailSchema
} = require("../../Validations/userShema");

const validateMiddlwarePost = validation(userSchemaJoi);

const validateMiddlwarePostEmail = validation(verifyEmailSchema);

userRouter.post("/register", validateMiddlwarePost, tryCatchWrapper(userControlers.register));
userRouter.post("/login",validateMiddlwarePost, tryCatchWrapper(userControlers.login));
userRouter.post("/logout", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.logout));
userRouter.get("/current", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.current));
userRouter.patch("/avatars",  tryCatchWrapper(userMiddlewares),upload.single("image"), tryCatchWrapper(userControlers.avatars));
userRouter.get("/verify/:token", tryCatchWrapper(userControlers.verify));
userRouter.post("/verify",validateMiddlwarePostEmail, tryCatchWrapper(userControlers.ROSTverify));

module.exports = {
  userRouter,
};

