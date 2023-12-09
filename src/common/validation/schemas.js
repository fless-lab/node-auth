const Joi = require('@hapi/joi')

const registrationSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  avatar: Joi.string(),
})

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
})

const verifyAccountSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  code: Joi.string(),
})


module.exports = {
  loginSchema,
  registrationSchema,
  verifyAccountSchema
}
