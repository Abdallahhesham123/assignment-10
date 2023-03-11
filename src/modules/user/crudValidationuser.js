import joi from "joi";



export const updateSchema = {
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
      FirstName: joi.string().alphanum().min(3).max(20).required().messages({
        "any.required":"username field is required",
        "string.empty":"Please fill your username field"
      }),
      LastName: joi.string().alphanum().min(3).max(20).required().messages({
        "any.required":"username field is required",
        "string.empty":"Please fill your username field"
      }),
      age:joi.number().integer().min(16).max(120).required().messages({
        "number.min":"your age should be greater than 16 years",
        "number.max":"your age should be less than 120 years",
      }),
      gender:joi.string().valid('Male',"Female").messages({
        "any.only":"gender field must be male or female"
      }),
     
      status:joi.string().valid('Online',"Offline").messages({
        "any.only":"gender field must be Online or Offline"
      }),
      phone:joi.string().pattern(
        new RegExp(/^01[0125][0-9]{8}$/)).required(),
        Profilepic:joi.string(),
        Coverpic:joi.string()
    }).required(),
    headers: joi.object({
        'authorization': joi.string().required().messages({
            "any.required":"headers must have  abearerkey"
        }),
    }).options({ allowUnknown: true })
  };
  export const headersSchema ={
    headers: joi.object({
      'authorization': joi.string().required().messages({
          "any.required":"headers must have  abearerkey"
      })
  }).options({ allowUnknown: true })

  }