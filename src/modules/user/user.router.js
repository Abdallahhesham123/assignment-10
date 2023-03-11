import {Router} from 'express'
import * as userController from  './controller/user.js'
import { AuthUser } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import {  updateSchema ,headersSchema } from "./crudValidationuser.js";
import { fileupload, fileValidation } from '../../utils/multer.js';
// import { fileupload, fileValidation } from '../../utils/multerAnction.js';
const router = Router();

router.patch("/profilePic",
fileupload('user/profile',fileValidation.image).single("image")
,AuthUser , userController.profilePicUpdated)


//if iwant to share photo and pdf
// [...fileValidation.image , ...fileValidation.file[0]] instaed of fileValidation.image


router.patch("/Coverpic",
fileupload('user/cover',fileValidation.image).array("image" ,10)
,AuthUser , userController.Coverpic)

router.get("/" ,  AuthUser,userController.getUserModule)
router.get("/getProfile" ,  AuthUser,userController.getProfile)

//update with diffrent methode
router.put("/findByIdAndUpdate" ,validation(updateSchema), AuthUser,userController.findByIdAndUpdate)
//delete with diffrent methode
router.delete("/findOneAndDelete" , validation(headersSchema),AuthUser, userController.findOneAndDelete)
//soft-delete
router.put("/softDelete" , AuthUser,userController.softDelete)
router.put("/restoretodatabase" , AuthUser,userController.restoretodatabase)







export default  router