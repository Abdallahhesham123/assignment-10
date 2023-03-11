import UserModel from "../../../../DB/model/User.model.js";
import BookModel from "../../../../DB/model/Book.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import moment from "moment";
import BookMangeModel from "../../../../DB/model/BookManage.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
export const getProductModule = (req, res, next) => {
  return res.json({ message: "Product module" });
};

export const addBook = asyncHandler(async (req, res, next) => {
  const { title, Author, User_Id, DataReturned ,isBorrowed} = req.body;
  const checkBook = await BookModel.findOne({ title });
  if (checkBook) {
    return next(new Error("This title book is exist pease chose another title",{cause :404}));
  }
  const user = await UserModel.findById(User_Id);
  if (user === null) {
    return next(new Error("Invalid_UserId"), { cause: 400 });
  } else {
    if (!req.file) {
      return next(new Error("File is required"), { cause: 400 });
    }

    const image = req.file.dest;
    const retunedDate = new Date(DataReturned).toISOString();
    const Book = await BookModel.create({
      title,
      Author,
      image,
      isBorrowed,
      User_Id,
      retunedDate,
    });

    return res
      .status(200)
      .json({ message: "Your Book is added Successfully", Book });
  }
});
//first Table
export const getAllbooks = asyncHandler(async (req, res, next) => {
  const books = await BookModel.find({}).select(
    "title Author image isBorrowed"
  );

  return res.json({ message: "Done", books });
});
export const issuedBook = asyncHandler(async (req, res, next) => {
  const books = await BookModel.find({}).select("title createdAt retunedDate");

  return res.json({ message: "Done", books });
});
export const searchBook = asyncHandler(async (req, res, next) => {
  const { title } = req.query;
  const regexp = new RegExp(`${title}`);
  const books = await BookModel.find({
    isBorrowed: true,
    title: regexp,
  });

  return res.json({ message: "Done", data: books });
});
export const manageBook = asyncHandler(async (req, res, next) => {
  const { Fine } = req.query;
  const nowTime = Date.now();
  const books = await BookModel.find({
    retunedDate: { $lt: `${nowTime}` },
    isBorrowed: true
  }).select("createdAt retunedDate");
  console.log(books);
  for (const book of books) {
    const returned_date = moment(book.retunedDate);
    const now = moment(Date.now());
    const Fine_time = returned_date.diff(now, "days"); // 1
        console.log(Fine_time);
    const bookmanagedcontrol = await BookMangeModel.findOne({
      "Book_Id":book._id.toString(),
})
 if (Fine_time < 0) {
      const fine = Fine * Math.abs(Fine_time);
      const late = Math.abs(Fine_time);
              if(!bookmanagedcontrol){
                const newbookManage = new BookMangeModel({
                  Fine: fine,
                  Late: late,
                  Book_Id: book._id,
                });
                await newbookManage.save();
            }
  }

  }

  return res.json({ message: "Done we created fine table" });
});

export const manageBookTable = asyncHandler(async (req, res, next) => {
  const books = await BookMangeModel.find({})
    .select("Fine Late")
    .populate({ path: "Book_Id", select: "_id title" });

  return res.json({ message: "Done", books });
});

export const updateBook = asyncHandler(async(req,res,next)=>{

  const {Book_Id}= req.params;
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  const fullpath= path.join(__dirname,"../../../uploads")
  const book = await BookModel.findById(Book_Id)
if(book){
  const book = await BookModel.findByIdAndUpdate(
    { _id:Book_Id },
    req.body,
    { new: false }
  )
console.log(book.image);
console.log(req.body.image)
  if(book.image && book.image !== req.body.image) {
    const newdata = book.image.replace("/","\\")
    fs.unlinkSync(`${fullpath}\\${newdata}`);
  }
    return book
    ? res.json({ message: "book Updated Sucsessfully", book })
    :  next(new Error("Error-Occured During updated "));
}else{
  next(new Error("InValid-BookId"));
} 
})

export const deleteBook = asyncHandler(async(req,res,next)=>{

  const {Book_Id}= req.params;
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  const fullpath= path.join(__dirname,"../../../uploads")
  const book = await BookModel.findById(Book_Id)
if(book){
  const book = await BookModel.findByIdAndDelete(Book_Id)

  if(book.image && book.image !== req.body.image) {
    const newdata = book.image.replace("/","\\")
    fs.unlinkSync(`${fullpath}\\${newdata}`);
  }
    return book
    ? res.json({ message: "book deleted Sucsessfully" })
    :  next(new Error("Error-Occured During delete Book "));
}else{
  next(new Error("InValid-BookId"));
} 
})