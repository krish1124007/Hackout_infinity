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
    findLand,
    savePrePlantData,
    saveDataProject,
    sendMachines
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
router.route('/saveoldplantdata').post(verifyAccessToken , savePrePlantData);
router.route('/saveproject').post(verifyAccessToken,saveDataProject);
router.route('/getmachines').post(sendMachines)



export const user_router = router;
