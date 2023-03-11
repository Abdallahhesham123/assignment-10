const dataMethods = ["body", "query", "params", "headers"];

export const validation = (schema) => {
  return (req, res, next) => {
    const validationArry = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationArry.push(validationResult.error);
        }
      }
    });


    if (validationArry.length > 0) {
        return res.status(404).json({message :"validation error From server",
         validationArry:validationArry });
      }else{
        return next();
      }
  };


};
