const express = require("express");
const userControlers = require("../../models/user");
const { tryCatchWrapper } = require("../../helpers/index");
const { userMiddlewares } = require("../../middleweras/userMiddlewares");
const { upload } = require('../../middleweras/uploadAvatars');
const userRouter = express.Router();
const {
  userSchemaJoi,
    verifyEmailSchema
} = require("../../Validations/userShema");


userRouter.post("/register", tryCatchWrapper(userSchemaJoi), tryCatchWrapper(userControlers.register));
userRouter.post("/login",tryCatchWrapper(userSchemaJoi), tryCatchWrapper(userControlers.login));
userRouter.post("/logout", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.logout));
userRouter.get("/current", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.current));
userRouter.patch("/avatars",  tryCatchWrapper(userMiddlewares),upload.single("image"), tryCatchWrapper(userControlers.avatars));
userRouter.get("/verify/:token", tryCatchWrapper(userControlers.verify));
userRouter.post("/verify",tryCatchWrapper(verifyEmailSchema), tryCatchWrapper(userControlers.ROSTverify));

module.exports = {
  userRouter,
};

