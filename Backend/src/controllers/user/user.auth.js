import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnRespones } from "../../utils/apiresponse.js  "
import { isAccountExists } from "../../utils/isexists.js";
import { inngest } from "../../inngest/client.js";
import { OTP } from "../../models/otp.model.js"

const createAccount = asyncHandler(async (req, res) => {
    console.log("req body is ", req.body)
    const { email, password, username } = req.body;


    if (!email || !password || !username) {
        returnRespones(res, 400, "please enter email and passwordboth", { success: false, data: null })
    }

    const isexists = await isAccountExists({email});

    if (isexists.exist) {
       return  returnRespones(res, 400, "This account is already exits", { success: false, data: null })
    }


    const createaccount = await User.create({ email, password,username })


    if (!createaccount) {
        returnRespones(res, 500, "something error generate while the creating user account", { success: false, data: null })
    }

    const accessToken = createaccount.generateAccessToken();

    if (!accessToken) {
        return returnRespones(res, 500, "somethign while problem to create accesstoken", { success: false, data: "something while problem to create accesstken" })
    }

    return returnRespones(res, 200, "user account is created successfully", { success: true, data: createaccount }, true, accessToken)
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return returnRespones(res, 400, "please enter email and password both", { success: false, data: "please enter email and password both" })
    }

    const isExist = await isAccountExists({ email: email });
    console.log(isExist.data)
    if (!isExist.exist) {
        return returnRespones(res, 400, "this account is not exist please use valid credentials", { success: false, data: "this account is not exist please use valid credentials" })
    }

    const accesstoken = await isExist.data.generateAccessToken();
    if (!accesstoken) {
        return returnRespones(res, 500, "accesstoken not generated", { success: false, data: "accesstoken is not generated" })
    }

    return returnRespones(res, 200, "accesstoken generate successfully", { success: true, data: accesstoken }, true, accesstoken)
})

const deleteAccountOTP = asyncHandler(async (req, res) => {
    const { password } = req.body;

    const checkuser = await User.findById(req.user._id);

    const isPasswordcorrect = await checkuser.isPasswordCorrent(password);

    if (!isPasswordcorrect) {
        returnRespones(res, 400, "password is incorrect", { success: false, data: "password is incorrect" });
    }


    //this code run for the sim verification


    //this code run fot the otp verification
    await inngest.send({
        name: "user/delete",
        data: { email: checkuser.email }
    })

    return returnRespones(res,200, "otp send for delation successfully", { success: false, data: "otp send for delation successfully" })

})

const deleteAccount = asyncHandler(async(req,res)=>{
    const {otp} = req.body;
    const {email} = req.user;

    if(!otp){
        return returnRespones(res,400,"please write otp" , {success:false , data:"please fillup otp"})
    }

    const isOTPValid = await OTP.findOne({email,otp})

    if(!isOTPValid)
    {
        return returnRespones(res,400,"please enter valid otp" , {success:false , data:"please enter valid otp"})
    }

    const deleteAccount = await User.deleteOne({email});
    const deleteOTP = await OTP.deleteOne({email});

    return returnRespones(res,200,"Account delete successfully" , {success:true , data:"Account delete successfully"})
})


export {
    createAccount,
    login,
    deleteAccountOTP,
    deleteAccount
}