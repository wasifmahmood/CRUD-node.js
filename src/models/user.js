//models

const { required, number, date, string } = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,

  },
  token: String
  
});
const User = mongoose.model("Users", userSchema);
module.exports = User;
