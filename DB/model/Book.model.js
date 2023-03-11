import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [3, "Too short Title"],
      maxlength: [20, "Too long Title"],
    },
    Author: {
      type: String,
      trim: true,
      minlength: [3, "Too short Author"],
      maxlength: [20, "Too long Author"],
    },
    
    image: {
      type: String,
      default: ""
    },
    User_Id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Book must be belong to parent user"],
    },
    isBorrowed:{
        type:Boolean,
        default:false
    },
    retunedDate:{
      type:Date,
      default:Date.now() + (2*60*60*24)
    }
  },
  { timestamps: true }
);

const BookModel = mongoose.model("Book", bookSchema);

export default BookModel

