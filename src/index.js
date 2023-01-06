const express = require("express");
const mongoose = require("mongoose");
const authHandler = require("./middleware/auth");
const User = require("./models/user");
const Teacher = require("./models/teacher");
const router = require("./routes/user/user.controller");
const router1 = require("./routes/teacher/teacher.controller");
const cors = require ('cors')
const app = express();
app.use(cors());
app.use(express.json());
// app.use(authHandler);

mongoose
  .connect("mongodb://localhost:27017/bootcamp")
  .then(() => console.log("MongoDB attach hogi h"))
  .catch((error) => console.log(`MongoDB me masla aa raha, ${error}`));

app.use("/users", router);
app.use("/teachers",router1);
app.listen(5000, () => console.log("App chal rhi hai 5000 pe"));
