const express = require("express");
const errorHandler = require("../../middleware/error");
const { generateAuthToken } = require("../../utils/helpers");
const { FormateTeacherObj } = require("./teacherFormatter");
const createTeacherSchema = require("./validationSchema");
const jwt_decode = require("jwt-decode");
const Teacher = require("../../models/teacher");
const router1 = express.Router();
require("dotenv").config();

//get teachers
router1.get(
  "/",
  errorHandler(async (req, res) => {
    const teacher = await Teacher.find();

    res.status(200).send(teacher);
  })
);

//teacher signup
router1.post("/signup", async (req, res) => {
  const payload = req.body;
  const { error } = createTeacherSchema(payload);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  let teacher = new Teacher(payload);

  teacher = await teacher.save();
  res.status(200).send({ teacher });
});

//teacher update
router1.put("/:teacherId", async (req, res) => {
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.params.teacherId,
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
        updatedTeacher,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router1;
