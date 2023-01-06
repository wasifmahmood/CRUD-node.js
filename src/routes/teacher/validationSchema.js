const Joi = require("joi");

const createTeacherSchema = (teacher) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    title: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    lastName: Joi.string().required(),
    fatherName: Joi.string().required(),
    gender: Joi.string().required(),
    experience: Joi.string().required(),
    aboutExperience: Joi.string().required(),
    details: Joi.string().required(),
    address: Joi.string().required(),
    additionalInformation: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    skypeId: Joi.string().required(),
    dob: Joi.string().required(),
    number: Joi.number().required(),
    // isStudent: Joi.boolean().optional(),
  });
 

  return schema.validate(teacher);
};

module.exports = createTeacherSchema;
