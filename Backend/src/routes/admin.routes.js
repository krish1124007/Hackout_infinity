import {
    deleteAllUser,
    uploadUpdate,
    mailToAll,
    getAllUser,
    blockUser,
    deleteUser,
    mailToPersonal,
    displayHelp
} from "../controllers/admin/admin.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"


const router = Router();

router.route('/user/opreation/deleteAll').post(deleteAllUser);
router.route('/mailtomany').post(mailToAll)
router.route('/test/upload').post(upload.single("file"), uploadUpdate)
router.route('/mailtone').post(mailToPersonal)
router.route('/user/opreation/getalluser').post(getAllUser)
router.route('/user/opreation/blockuser').post(blockUser);
router.route('/user/opreation/deleteuser').post(deleteUser);
router.route('/displayhelp').post(displayHelp)

export const admin_router = router;