
import joi from "joi";

export const signUpSchema = {
  body: joi.object({
    username: joi.string().alphanum().min(3).max(20).required().messages({
      "any.required":"username field is required",
      "string.empty":"Please fill your username field"
    }),
    email: joi.string()
    .email({ minDomainSegments: 2 ,maxDomainSegments:3 ,tlds:{allow:["com","net"]}})
    .required().messages({
      "string.empty":"Please fill your email field",
      "any.required":"email field is required",
    }),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required().messages({
        "string.empty":"Please fill your password field",
        "any.required":"password field is required",
      }),
    confirm_pass: joi.string().valid(joi.ref("password")).required().messages({
      "any.only":"this field must be matched with password field"
    }),
  }).required(),
};

export const LoginSchema = {
  body: joi.object({
    email: joi.string()
    .email({ minDomainSegments: 2 ,maxDomainSegments:3 ,tlds:{allow:["com","net"]}})
    .required().messages({
      "string.empty":"Please fill your email field",
      "any.required":"email field is required",
    }),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required().messages({
        "string.empty":"Please fill your password field",
        "any.required":"password field is required",
      }),
  }),
};

export const resetPassword = {
  body: joi.object({
    oldpassword: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required().messages({
        "string.empty":"Please fill your oldpassword field",
        "any.required":"oldpassword field is required",
      }),
    password: joi
      .string().invalid(joi.ref("oldpassword"))
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required().messages({
        "string.empty":"Please fill your oldpassword field",
        "any.required":"oldpassword field is required",
      }),
    confirm_pass: joi.string().valid(joi.ref("password")).required().messages({
      "any.only":"this field must be matched with password field"
    }),
  }),
};
export const userPasswordResetGen = {
  body: joi.object({
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required().messages({
        "string.empty":"Please fill your oldpassword field",
        "any.required":"oldpassword field is required",
      }),
    confirm_pass: joi.string().valid(joi.ref("password")).required().messages({
      "any.only":"this field must be matched with password field"
    }),
  }),
  params:joi.object({

    id:joi.string().min(24).max(24).required().messages({
        "any.required":" receiverId is required",
        "string.min" :"Please enter a valid receiverId equal  24 charachter",
        "string.max" :"Please enter a valid receiverId equal  24 charachter"
    }),
    token:joi.string().required().messages({
      "any.required":" receiverId is required",
  }),
  }),
};


