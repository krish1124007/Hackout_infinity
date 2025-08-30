import {
    createMachineSeller,
    loginMachineSeller,
    createProduct,
    getAllProducts,
    updateProduct
} from "../controllers/machineseller/machineseller.auth.js"
import {verifyAccessToken} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { Router } from "express"

const router = Router();

router.route('/create').post(createMachineSeller);
router.route('/login').post(loginMachineSeller);
router.route('/createproduct').post(verifyAccessToken,upload.single("file"),createProduct)
router.route('/getallproduct').post(verifyAccessToken,getAllProducts);
router.route('/updateproduct').post(verifyAccessToken,updateProduct);

export const machineproduct_router = router