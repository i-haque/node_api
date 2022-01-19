const Joi = require('joi');

function validateNewUser(requestObject) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(20).required(),
  }).length(4);

  const { error } = schema.validate(requestObject);
  if (error) return error.details[0].message;
}

function login(requestObject) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).length(2);

  const { error } = schema.validate(requestObject);
  if (error) return error.details[0].message;
}

function validateUser(requestObject) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(requestObject);
  if (error) return error.details[0].message;
}

module.exports = { validateNewUser, login, validateUser };
