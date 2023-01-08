const express = require("express");
const authHandler = require("../../middleware/auth");
const errorHandler = require("../../middleware/error");
const User = require("../../models/user");
const { generateAuthToken } = require("../../utils/helpers");
const { FormateUserObj } = require("./UserFormatter");
const createUserSchema = require("./validationSchema");
const jwt_decode = require("jwt-decode");
const router = express.Router();
const twilio = require("twilio");
const { sendVerificationEmail } = require("../user/email");
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
//verification of email
router.get(
  "/verifyUser",
  errorHandler(async (req, res) => {
    const user = await User.findOne({ token: req.query.token });
    await User.findByIdAndUpdate({ _id: user._id }, { token: "" });

    res.status(200).send({
      status: true,
      message: "VERIFICATION COMPLETED",
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
        .sort({ username: 1 });

      res.status(200).send(users);
    } else {
      const users = await User.find().sort({ username: 1 });
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


// -------------- Twilio Send SMS ----------------

const accountSid = "AC09ad87a684c974e7f6c5f406ee561d0b";
const authToken = "fcff405f09ebe0eee1d45b0ecaca5636";
const client = new twilio(accountSid, authToken);

router.get("/send-sms", (req, res) => {
  // const accountSid = "AC09ad87a684c974e7f6c5f406ee561d0b";
  // const authToken = "fcff405f09ebe0eee1d45b0ecaca5636";
  // const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: "Hello wasifmahmood",
      from: "+18507539761",
      to: "+923013963678",
    })
    .then((message) => console.log(message.sid));
    res.status(200).send({message: "Message Send Successfully"})
  });

  
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
router.post("/signup", async (req, res) => {
  const payload = req.body;
  const { error } = createUserSchema(payload);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  let user = new User(payload);
  const token = generateAuthToken({
    username: user.username,
    email: user.email,
  });

  // payload.token = token
  user = await user.save();
  await User.findByIdAndUpdate({ _id: user._id }, { token: token });
  const UserObj = FormateUserObj(user);
  //to send verification code
  sendVerificationEmail(payload.email, token);
  res
    .status(200)
    .send({ status: true, message: "Signup successfully!", UserObj, token });
});

// router.post("/sendSMS", (req, res) => {
//   const { to, body } = req.body;
//   client.messages
//     .create({
//        body,
//        from: +17262009836,
//        to:+923013963678,
//      })
//     .then(message => console.log(message)).catch((err)=>{
//       res.status(400).send({message: err})
//     });
//     res.status(200).send({message: "Message Send Successfully"})

//   });

module.exports = router;
