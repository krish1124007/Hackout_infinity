import {
    createAccount,
    login,
    deleteAccount,
    deleteAccountOTP
} from "../controllers/user/user.auth.js";

import { 
    createHelp,
    getProfile,
    updateProfile,
    findLand
 } from "../controllers/user/user.controller.js";
import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/create').post(createAccount);
router.route('/login').post(login);
router.route('/deleteaccount').post(verifyAccessToken, deleteAccount);
router.route('/deleteaccountotp').post(verifyAccessToken, deleteAccountOTP);
router.route('/createhelp').post(verifyAccessToken, createHelp);
router.route('/getprofile').post(verifyAccessToken , getProfile);
router.route('/updateprofile').post(verifyAccessToken , updateProfile);
router.route('/findland').post(findLand);



export const user_router = router;
