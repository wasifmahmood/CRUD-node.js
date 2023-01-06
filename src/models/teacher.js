//models

const { required, number, date, string } = require("joi");
const mongoose = require("mongoose");
const TeacherSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  
  },
  lastName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  aboutExperience: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  additionalInformation: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  skypeId: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: String,
});
const Teacher = mongoose.model("Teachers", TeacherSchema);
module.exports = Teacher;
