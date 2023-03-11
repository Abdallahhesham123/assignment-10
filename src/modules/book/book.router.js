import {Router} from 'express'
import * as bookController from  './controller/book.js'
import { AuthUser } from '../../middleware/auth.js';
import { fileupload, fileValidation } from '../../utils/multer.js';
import { validation } from '../../middleware/validation.js';
import { AddedSchema, UpdatedSchema } from './BookValidation.js';
const router = Router();


router.get("/" , bookController.getProductModule)
router.post("/" ,fileupload("book/store",fileValidation.image).single("image"), 
validation(AddedSchema),
AuthUser,bookController.addBook)
//update book
router.put("/updateBook/:Book_Id"
 ,fileupload("book/store",fileValidation.image).single("image")
,validation(UpdatedSchema),AuthUser, bookController.updateBook)
//delete book
router.delete("/deleteBook/:Book_Id"
 ,fileupload("book/store",fileValidation.image).single("image")
,AuthUser, bookController.deleteBook)
//get all books
router.get("/allbooks" , AuthUser,bookController.getAllbooks)
//get Manage issued book
router.get("/issuedBook" ,AuthUser, bookController.issuedBook)
//search for issued book
router.get("/searchBook" ,AuthUser, bookController.searchBook)
//get Mananage issued book
router.get("/manageBook" ,AuthUser, bookController.manageBook)
//get Mananage issued bookTable
router.get("/manageBookTable" ,AuthUser, bookController.manageBookTable)


export default  router