import joi from "joi";



export const AddedSchema = {
    body: joi.object({
      image:joi.string().messages({
        "any.required":"image field is required",
        "string.empty":"Please fill your image field"
      }),
        title: joi.string().alphanum().min(3).max(20).required().messages({
        "any.required":"title field is required",
        "string.empty":"Please fill your title field"
      }),
      Author: joi.string().alphanum().min(3).max(20).required().messages({
        "any.required":"Author field is required",
        "string.empty":"Please fill your author field"
      }),
      User_Id: joi.string().min(24).max(24).required().messages({
        "any.required":"User_Id field is required",
        "string.empty":"Please fill your User_Id field"
      }),
      isBorrowed: joi.boolean().required().messages({
        "any.required":"isBorrowed field is required",
      }),
      DataReturned:joi.date().required().messages({
        "date.base":"please enter avalid date",
        "any.required":"DataReturned field is required",
      }),
       

    }).required(),
    headers: joi.object({
        'authorization': joi.string().required().messages({
            "any.required":"headers must have  abearerkey"
        }),
    }).options({ allowUnknown: true })
  };
  export const UpdatedSchema = {
    body: joi.object({
      image:joi.string().messages({
        "any.required":"image field is required",
        "string.empty":"Please fill your image field"
      }),
        title: joi.string().alphanum().min(3).max(20).messages({
        "string.empty":"Please fill your title field"
      }),
      Author: joi.string().alphanum().min(3).max(20).messages({
        "string.empty":"Please fill your author field"
      }),
      User_Id: joi.string().min(24).max(24).messages({
        "string.empty":"Please fill your User_Id field"
      }),
      isBorrowed: joi.boolean(),
      DataReturned:joi.date().messages({
        "date.base":"please enter avalid date",
      }),
       

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