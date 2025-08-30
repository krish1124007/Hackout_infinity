import { MachineSeller } from "../../models/machineseller.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnRespones } from "../../utils/apiresponse.js"
import { ProductMachine } from "../../models/productmachine.model.js";


const createMachineSeller = asyncHandler(async (req, res) => {
    const { email, password, contact_number, location } = req.body;
    console.log(email,password)
    if (!email || !password) {
        return returnRespones(res, 400, "please fillup all feilds", { success: false, data: "please fillup all feilds" })
    }

    const isSellerExist = await MachineSeller.findOne({ email });
    if (isSellerExist) {

        return returnRespones(res, 300, "account already exist please login", { success: false, data: "account exists please login" })
    }

    const createAccount = await MachineSeller.create({ email, password, location, contact_number })
    if (!createAccount) {
        return returnRespones(res, 500, "something went wrong account is not created", { success: false, data: "something went wrong account is not created" })
    }

    const accesstoken = createAccount.generateAccessToken();
    if (!accesstoken) {
        return returnRespones(res, 500, "something problem to generate accesstoken", { success: false, data: "something problem to genereat accesstoken" })
    }


    return returnRespones(res, 200, "account creates successfully", { success: true, data: accesstoken })


})


const loginMachineSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return returnRespones(res, 400, "please fillup all feilds", { success: false, data: "please fillup all feilds" })
    }

    const isExist = await MachineSeller.findOne({ email });

    if (!isExist) {
        return returnRespones(res, 300, "This account is not exist please first register", { success: false, data: "this account is not exist please first register" })
    }

    const isPasscorrect = await isExist.isPasswordCorrent(password);

    if (!isPasscorrect) {
        return returnRespones(res, 400, "please enter correct password", { success: false, data: "please enter correct password" })
    }

    const accesstoken = isExist.generateAccessToken();

    if (!accesstoken) {
        return returnRespones(res, 500, "fail to generate accesstoken please try again", { success: false, data: "failed to generate accesstoken please try again" })
    }

    return returnRespones(res, 200, "account login successfully", { success: true, data: accesstoken })
})


const createProduct = asyncHandler(async (req, res) => {
    const { discription, price, quantity } = req.body;
    const imagelink = req.file.path;

    if (!discription || !price) {
        return returnRespones(res, 400, "please enter discriptoin and price", { success: false, data: "please enter discription and price" })
    }

    const create_product = await ProductMachine.create(
        {
            userId: req.user._id,
            discription,
            image: imagelink,
            price
        }
    );

    if (!create_product) {
        return returnRespones(res, 500, "feiled to create the object", { success: false, data: "failed to create object" })
    }



    return returnRespones(res, 200, "product create successfully", { success: true, data: create_product })

})


const getAllProducts = asyncHandler(async (req, res) => {
    const products = await ProductMachine.find({userId:req.user._id});

    return returnRespones(res, 200, "product fetched successfully", { success: true, data: products })
})


const updateProduct = asyncHandler(async (req, res) => {
    const { userId, product_id, updateobject } = req.body;

    if (userId != req.user._id) {
        return returnRespones(res, 300, "You are not able to update this object", { success: false, data: "you are not able to update this object" })
    }

    if (!product_id) {
        return returnRespones(res, 400, "please enter productId", { success: false, data: "please eneter productId" })
    }

    const find_product = await ProductMachine.findByIdAndUpdate(product_id, updateobject, { new: true });

    if (!find_product) {
        return returnRespones(res, 500, "can't update object", { success: false, data: "can't update object" })
    }


    return returnRespones(res, 200, "object update object", { success: true, data: find_product });

})



export {
    createMachineSeller,
    loginMachineSeller,
    createProduct,
    getAllProducts,
    updateProduct
}