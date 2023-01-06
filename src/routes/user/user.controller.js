const express = require("express");
const authHandler = require("../../middleware/auth");
const errorHandler = require("../../middleware/error");
const User = require("../../models/user");
const { generateAuthToken } = require("../../utils/helpers");
const { FormateUserObj } = require("./UserFormatter");
const createUserSchema = require("./validationSchema");
const jwt_decode = require("jwt-decode");
const router = express.Router();
require("dotenv").config();

//create the logout route
router.get(
  "/logout",
  authHandler,
  errorHandler(async (req, res) => {
    console.log(req.params);
    const user = await User.findOne({ token: req.headers.token });
    await User.findOneAndUpdate({ _id: user._id }, { token: "" });
    res.status(200).send({
      status: true,
      message: "Logout successfully",
    });
  })
);

// create the get route
router.get(
  "/",
  errorHandler(async (req, res) => {
    if (req.headers.limit !== undefined) {
      const limit = req.headers.limit;
      const skip = req.headers.skip;
      const users = await User.find()
        .limit(limit)
        .skip(skip)
        .sort({username: 1 });
        
      res.status(200).send(users);
    } else {
      const users = await User.find();
      res.status(200).send(users);
    }
  })
);

// create the get route by id
router.get(
  "/:userId",
  errorHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId });
    const UserObj = FormateUserObj(user);
    res.status(200).send({
      status: true,
      message: "user found successfully",
      data: UserObj,
    });
  })
);

//create the POST route
router.post("/", async (req, res) => {
  const payload = req.body;
  const { error } = createUserSchema(payload);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  let user = new User(payload);

  user = await user.save();
  res.status(200).send({ user });
});

//create the update route
router.put("/:userId", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  try {
    res.status(200).json({
      status: "Update Hogya Hai",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//delete the route
router.delete("/:userId", async (req, res) => {
  const id = req.params.userId;
  await User.findByIdAndRemove(id).exec();
  res.send("User Delete kr Diya Hai");
});

// create a login route
router.post("/login", authHandler, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ message: "Email or Password Sahi Nahi Hn" });
  }

  if (req.body.password !== user.password) {
    return res.status(400).send({ message: "Email or Password Sahi Nhai Hn" });
  }

  const token = generateAuthToken({
    username: user.username,
    email: user.email,
    id: user._id,
  });
  user.token = token;
  await User.findOneAndUpdate({ _id: user._id }, { token: token });
  res.status(200).send({ message: "Update Hogya Hai", token, user });
});

// create the  signup route
router.post("/signup", authHandler, async (req, res) => {
  const payload = req.body;
  const { error } = User(payload);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  let user = new User(payload);
  user = await user.save();
  res.status(200).send({ user });
});

module.exports = router;
