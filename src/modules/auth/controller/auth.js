import UserModel from "../../../../DB/model/User.model.js";
import verifyModel from "../../../../DB/model/VerificationTokenEmail.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { generateOtp } from "../../../utils/verification.js";
import transporter from "./../../../../DB/emailConfig.js";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

dotenv.config();
const { JWT_SECRET_KEY, EMAIL_FROM } = process.env;

export const getAuthModule = (req, res, next) => {
  return res.json({ message: "Auth module" });
};

export const register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;
  // console.log(req.body);
  const checkUser = await UserModel.findOne({ email });
  if (checkUser) {
    // return res
    //   .status(404)
    //   .json({ message: "Email Exist Please chose another Email" });

    return next(new Error("Email Exist Please chose another Email",{cause :404}));
  }

  req.body.password = hash({ plaintext: password });
  const newUser = new UserModel(req.body);

  let OTP = generateOtp();
  // console.log(otp);
  const tokenVerify = hash({ plaintext: OTP });

  const newVerification = new verifyModel({
    owner: newUser._id,
    token: tokenVerify,
  });

  await newVerification.save();
  await newUser.save();
// console.log(newUser);
  const link = `http://127.0.0.1:3000/verification-email/${newUser._id}`;
  const RefreshToken = generateToken({payload:{
    email: newUser.email
  },
  expiresIn: 60 * 60 * 24 * 30})
  const RefreshLink =`${req.protocol}://${req.headers.host}/auth/verification-email/${RefreshToken}`
  // Send Email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to:email,
    subject: "abdallah-Site - Verification Email Link",
    html: `     
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
    </head>
    <body>
        <div class="container" style="text-align: center; width:90% ; ;margin: 10px auto;">
            <h1 style="text-align: center; width: 70%;margin: 10px auto;background-color: blueviolet;">
                 We Are Delighted To Welcome You To our Team
                </h1>
    <p style="font-size: medium;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 300;">
        Please Enter Your pin code In form To verify Your email And Enter Site : 
        <span style="color: red; font-size: larger;font-weight: 900;">${OTP}</span>
    </p>
    <p style="font-size: medium;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 300;">
    To verify Your Email Please Enter  this pin code is This link :
    <a style="color: red; font-size: larger;font-weight: 900;" href=${link}>Click Here</a><br>
    To verify Your Email This  Link To Send Your vervication Again:
    <a style="color: blue; font-size: larger;font-weight: 900;" href=${RefreshLink}>Click Here</a>
    </p>
        </div>
    </body>
    </html>
            
            
             `,
  });
  return res
    .status(200)
    .json({ message: "Successfully Register Please Logged In " });
});

export const login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
console.log(req.body);
  const user = await UserModel.findOne({
    email: email,
    isDeleted: false,
    confirmEmail:true
  });

  if (!user.confirmEmail ===  true) {
    // return res.status(404).json({ message: "Invalid Email or password" });
    return next(new Error("you can not access to site without Confirm Email check your mail" ,{cause :404}));
  }


  if (!user) {
    // return res.status(404).json({ message: "Invalid Email or password" });
    return next(new Error("Invalid Email or password" ,{cause :404}));
  }

  const checkPassword = compare({
    plaintext: password,
    hashValue: user.password,
  });

  if (!checkPassword) {
    // return res.status(404).json({ message: "Invalid Email or password" });
    return next(new Error("Invalid Email or password" ,{cause :404}));
  }

  const token = generateToken({
    payload: {
      id: user._id,
      username: user.username,
      role: user.role,
      Profilepic: user.Profilepic,
      Coverpic: user.Coverpic,
      isLoggedIn: true,
    },
    expiresIn: 60 * 60 * 24 * 30,
  });

  user.status = "Online";
  user.save();

  return res.status(200).json({ message: "Successfully Logged In", token });
});

export const resetpassword = asyncHandler(async (req, res, next) => {
  const { oldpassword, password, confirm_pass } = req.body;

  if (password != confirm_pass) {
    // return res
    //   .status(404)
    //   .json({ message: "Password and comfirm password do not match" });
    return next(new Error("Password and comfirm password do not match" ,{cause :404}));
  }

  const checkUser = await UserModel.findById(req.user._id);
  // console.log(checkUser);

  if (!checkUser) {
    // return res
    //   .status(404)
    //   .json({ message: "This User Isnot Exist in database" });

    return next(new Error("This User Isnot Exist in database" ,{cause :404}));
  } else {
    const checkPassword = compare({
      plaintext: oldpassword,
      hashValue: checkUser.password,
    });
    if (!checkPassword) {
      // return res
      //   .status(404)
      //   .json({ message: "password isnot exist in database" });
      return next(new Error("password isnot exist in database" ,{cause :404}));
    }
  }
  const passwordHash = hash({ plaintext: password });
  await UserModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      password: passwordHash,
    }
  );
  return res
    .status(200)
    .json({ message: "Congratulation ,Your Password Changed " });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { otp, UserId } = req.params;
// console.log(req.params);
  if (!otp.trim() || !UserId) {
    return next(new Error("Invalid Request Missing Parameters" ,{cause :404}));
  }
  if (!isValidObjectId(UserId)) {
    return next(new Error("Invalid UserId"));
  }
  const user = await UserModel.findById(UserId);
  if (!user) {
    // return res.status(404).json({ message: "Invalid Email or password" });
    return next(new Error("Sorry, UserNot found" ,{cause :404}));
  }

  if (user.confirmEmail === true) {
    return next(new Error("This account is already confirmed" ,{cause :404}));
  }
  const userAccount = (user._id).toString();
  // console.log(user._id);
  const tokenVerifiedModel = await verifyModel.findOne({ owner: userAccount});
  if (!tokenVerifiedModel) {
    return next(new Error("This User is not found , Please Check Your Pin code" ,{cause :404}));
  }

  const checkTokenVerified = compare({
    plaintext: otp,
    hashValue: tokenVerifiedModel.token,
  });

  if (!checkTokenVerified) {
    return next(new Error("This is an error Match Verification" ,{cause :404}));
  }

  user.confirmEmail = true;

  await verifyModel.findByIdAndDelete(tokenVerifiedModel._id);
  const token = generateToken({
    payload: {
      id: user._id,
      role: user.role,
      Profilepic: user.Profilepic,
      Coverpic: user.Coverpic,
      isLoggedIn: true,
      confirmEmail:true
    },
    expiresIn: 60 * 60 * 24 * 30,
  });

  user.status = "Online";
  user.save();

  return res.status(200).json({ message: "this email is verified", token });
});
export const sendingemail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const secret = user._id + JWT_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: 60*5,
        });
        console.log(token);
        const link = `http://127.0.0.1:3000/reset-password/${user._id}/${token}`;
        // Send Email
        const info = await transporter.sendMail({
          from: EMAIL_FROM,
          to: user.email,
          subject: "abdallah-Blog - Password Reset Link",
          html: `
          
          
          
                  
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>
        </head>
        <body>
            <div class="container" style="text-align: center; width:90% ; ;margin: 10px auto;">
                <h1 style="text-align: center; width: 70%;margin: 10px auto;background-color: blueviolet;">
                     This link refer To reset your password
                    </h1>
 
        <p style="font-size: medium;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 300;">
        to Reset Your Password :
        <a style="color: red; font-size: larger;font-weight: 900;" href=${link}>Click Here</a>
        </p>
            </div>
        </body>
        </html>
               
          
          <a href=>Click Here</a> to Reset Your Password`,
        });
        res
          .status(200)
          .json({
            message: "Password Reset Email Sent... Please Check Your Email",
          });
      } else {
        res.status(404).json({ message: "Email doesn't exists" });
      }
    } else {
      res.status(404).json({ message: "Email Field is Required" });
    }
  } catch (err) {
    return res.status(404).json({ message: "Catch Error", err });
  }
};

export const userPasswordResetGen = async (req, res, next) => {
  const { password, confirm_pass } = req.body;
  const { id, token } = req.params;
  console.log(JWT_SECRET_KEY)
  const user = await UserModel.findById(id);
  const new_secret = user._id + JWT_SECRET_KEY;

  try {
    jwt.verify(token, new_secret);
    if (password && confirm_pass) {
      if (password !== confirm_pass) {
        res
          .status(404)
          .json({
            message: "New Password and Confirm New Password doesn't match",
          });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });
        res.status(200).json({ message: "Password Reset Successfully" });
      }
    } else {
      res.status(404).json({ message: "All Fields are Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Invalid Token" });
  }
};
export const verifyRefreshEmail = async(req,res ,next)=>{
  const {token}=req.params;
const {email}=verifyToken({token})


const link = `${req.protocol}://${req.headers.host}/auth/confirmation-email/${token}`;
const RefreshToken = generateToken({payload:{
  email
},
expiresIn: 60 * 60 * 24 * 30})
const RefreshLink =`${req.protocol}://${req.headers.host}/auth/verification-email/${RefreshToken}`
// Send Email
const info = await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: email,
  subject: "abdallah-Site - Verification Email Link",
  html: `     
  
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email</title>
  </head>
  <body>
      <div class="container" style="text-align: center; width:90% ; ;margin: 10px auto;">
          <h1 style="text-align: center; width: 70%;margin: 10px auto;background-color: blueviolet;">
               We Are Delighted To Welcome You To our Team
              </h1>

  <p style="font-size: medium;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 300;">
  To verify Your Email Please Click This link :
  <a style="color: red; font-size: larger;font-weight: 900;" href=${link}>Click Here</a><br>
  To verify Your Email This  Link To Send Your vervication Again:
  <a style="color: blue; font-size: larger;font-weight: 900;" href=${RefreshLink}>Click Here</a>
  </p>
      </div>
  </body>
  </html>
          
          
           `,
});
return res
  .status(200)
  .send("<p>Done Please Check Your mail</p>");
}

export const confirmationEmail = async(req,res,next)=>{


  const{token}= req.params;
  const{email}=verifyToken({token});
  const user = await UserModel.updateOne({email},{confirmEmail:true})
  return user.modifiedCount ? res.status(200).redirect("https://github.com/")
  :res.status(404).send("not register account")
}
