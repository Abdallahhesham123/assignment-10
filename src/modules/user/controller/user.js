
import jwt from "jsonwebtoken"
// import MessageModel from "../../../../DB/model/Message.model.js"
import UserModel from "../../../../DB/model/User.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';


export const getUserModule =asyncHandler( async (req, res, next) => {
   
    const users = await UserModel.find({ 
      isDeleted: false ,confirmEmail:true,
      "_id": {  $ne: `${req.user._id}` } 
    
    })
      .select("username _id Profilepic status")
    return res.json({ message: "Done", users });

});

export const getProfile = asyncHandler(async (req, res, next) => {

  //   const { id } = req.params;
    const user = await UserModel.findOne({ _id: req.user._id, isDeleted: false ,confirmEmail:true })
    .select("-password -confirmEmail -isDeleted ")
    return user
      ? res.json({ message: "user Profile Founded Sucsessfully", user })
      : next(new Error("InValid-UserId"));
     
});
export const softDelete =asyncHandler( async (req, res, next) => {

    const user = await UserModel.updateOne(
      { _id:req.user._id, isDeleted: false },
      { isDeleted: true }
    );


    return user.modifiedCount
      ? res.json({
          message: "user deleted Sucsessfully but this user in database" })
      :  next(new Error("InValid-UserId"));
     
});

export const restoretodatabase = asyncHandler( async (req, res, next) => {

    
    const user = await UserModel.updateOne(
      { _id:req.user._id, isDeleted: true },
      { isDeleted: false }
    );


    return user.modifiedCount
      ? res.json({
          message: "user Restored Sucsessfully and your post Restored" })
      :  next(new Error("InValid-UserId"));
     
});

export const findByIdAndUpdate = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  const fullpath= path.join(__dirname, "../../../../public/images/")
      const user = await UserModel.findByIdAndUpdate(
        { _id:req.user._id, isDeleted: false },
        req.body,
        { new: false }
      ).select("age username gender Profilepic Coverpic")

        if(user.Profilepic && user.Profilepic !== req.body.Profilepic) {
    const newdata = user.Profilepic.replace("/","\\")
    fs.unlinkSync(`${fullpath}${newdata}`);
    
  }
  if(user.Coverpic && user.Coverpic !== req.body.Coverpic) {
    const newCoverdata = user.Coverpic.replace("/","\\")
    fs.unlinkSync(`${fullpath}${newCoverdata}`);
    
  }
      return user
        ? res.json({ message: "user Updated Sucsessfully", user })
        :  next(new Error("InValid-UserId"));
       
  });

    //it is return object without modifiedCount( hardDeleted== deleted from database)
export const findOneAndDelete = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOneAndDelete({ _id: req.user._id, isDeleted: false });
  // await MessageModel.deleteMany({receiverId:req.user._id});
  return user
    ? res.json({ message: "user Deleted Sucsessfully from database" })
    : next(new Error("InValid-UserId"));
    
});

export const profilePicUpdated = asyncHandler(async (req, res, next) => {
  if(!req.file){
    return next(new Error("File is required"),{cause:400});
  }
const user = await UserModel.findByIdAndUpdate(req.user._id,{Profilepic:req.file.dest})

 return res.json({ message: "Done",user })

    
});

export const Coverpic = asyncHandler(async (req, res, next) => {
  if(!req.files?.length){
    return next(new Error("File is required"),{cause:400});
  }
const Coverpic=[]
  for (const file of req.files) {
    Coverpic.push(file.dest)
  }
  const user = await UserModel.findByIdAndUpdate(req.user._id,{Coverpic},{new:true})
  
   return res.json({ message: "Done",user})   
  }); 




