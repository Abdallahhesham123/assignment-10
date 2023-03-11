


export const validation =(schema)=>{

    return (req, res, next)=>{

        let { error } = schema.validate(req.body, { abortEarly: false });

        if(!error){
            next();
        }else{
            res.status(404).json(error.details)
        }
    }
}


