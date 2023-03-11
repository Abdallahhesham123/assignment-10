import mongoose from "mongoose"

const bookManageSchema = new mongoose.Schema(
  {
    Fine: {
      type: Number,
    },
    Late: {
      type: Number,
    },
    Book_Id: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: [true, "Book must be belong to parent user"],
    }
  },
  { timestamps: true }
);

const BookMangeModel = mongoose.model("BookManage", bookManageSchema);

export default BookMangeModel

