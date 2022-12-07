const { User } = require("../Validations/userShema");
const { Conflict, Unauthorized, NotFound } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const fs = require('fs/promises');
const path = require('path');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const { sendEmail } = require('../middleweras/nodemailer');
const { nanoid } = require('nanoid');

async function ROSTverify(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("No user found")
  }
  if (!user.verify) {
    const { email, password, verificationToken } = user;
    await sendEmail({ email, password, token: verificationToken });
    return res.json({message: "Verification email sent" });
  } else {
    return res.json({message: "Verification has already been passed"});
  }
}

async function verify(req, res, next) {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw new NotFound("No user found")
  }
  if (user && !user.verify) {
    await User.findByIdAndUpdate(user._id, {
      verify: true
    })
    return res.json({message: 'Verification successful'});
  }
  if (user && user.verify) {
    return res.json({message: 'Your email already verified'});
  } else {
    return res.json({message: 'User not found'});
  }
}


async function register(req, res, next) {
  const verificationToken = nanoid();
  const { email, password, subscription = "starter" } = req.body;
  const bcryptPassword = await bcrypt.hash(password, 10)
  const avatar = gravatar.url(email, { s: '250' });
  const user = new User({ email, password: bcryptPassword, avatarURL: avatar, subscription, verificationToken });
  try {
    await user.save();
    await sendEmail({email, password,  verificationToken})
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      throw new Conflict("User with this email already registered");
    }
    throw error;
  }
  return res.json({
    data: {
      user: {
        email: user.email,
        subscription: user.subscription
      }
    },
  });
}

async function login(req, res, next) {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("User does not exists");
  }
  if (!user.verify) {
    throw new Unauthorized("Email is not verifyed");
  }

  const isPasswordTheSame = await bcrypt.compare(password, user.password);
  if (!isPasswordTheSame) {
    throw new Unauthorized("wrong password");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
  user.token = token; 
  await User.findByIdAndUpdate(user._id, user);

  return res.json({
    data: {
      token,
      user: {
        email: user.email,
      }
    },
  });
}

async function logout(req, res, next) {
  const { user } = req;
  user.token = null;
  const result = await User.findByIdAndUpdate(user._id, user);
   
  if (!result) {
    throw new Unauthorized("Not found");
  }
  return res.json({});
}

async function current(req, res, next) {
  const { user } = req;
  const currentUser = await User.findById(user._id,{email: 1, subscription: 1, _id: 0});
  if (!currentUser) {
    throw new Unauthorized("Not found");
  }
  return res.json({currentUser});
}

async function avatars(req, res, next) {
  const { user, file } = req;
  
  const newPath = path.join("public/avatars", file.filename)
  await fs.rename(file.path, newPath)

  const avatars = await Jimp.read(newPath)
    .then(wgrg => {
    return wgrg
      .resize(250, 250)
      .quality(60)
      .write(newPath);
  })
  .catch(err => {
    console.error(err);
  });
  console.log(avatars)
  user.avatarURL = newPath;
  const result = await User.findByIdAndUpdate(user._id, user, { new: true });
  if (!result) {
    throw new Unauthorized("Not found");
  }
  return res.json({"avatarURL": result});
}

module.exports = {
  register,
  login,
  logout,
  current,
  avatars,
  verify,
  ROSTverify
};