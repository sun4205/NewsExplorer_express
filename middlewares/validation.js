const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("Invalid email");
};

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom(validateEmail).required().messages({
      "any.required": "Email is required.",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required.",
    }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "username" field is 2',
      "string.max": 'The maximum length of the "username" field is 30',
      "any.required": "Username is required.",
    }),

    email: Joi.string().custom(validateEmail).required().messages({
      "any.required": "Email is required.",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required.",
    }),
  }),
});
