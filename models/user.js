const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');


function validateUserSignUp(user) {
  const schema = Joi.object({
    UserName: Joi.string().min(5).max(50).required(),
    FirstName: Joi.string().min(5).max(50).required(),
    LastName: Joi.string().min(5).max(50).required(),
    Gender: Joi.string().min(3).max(50).required(),
    Country: Joi.string().min(5).max(50).required(),
    Email: Joi.string().min(5).max(255).required().email(),
    Password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}

function validateUserLogin(user) {
  const schema = Joi.object({
    UserName: Joi.string().min(5).max(50).required(),
    Password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}

exports.validateUserSignUp = validateUserSignUp;
exports.validateUserLogin = validateUserLogin;