import { returnRespones } from "../../utils/apiresponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Admin } from "../../models/admin.model.js";


const registerAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return returnRespones(res, 400, "please Enter email and password both", { success: false, data: "ObjectNotFound" })
    }

    const create_admin = await Admin.create({email , password})

    if(!create_admin)
    {
        return returnRespones(res , 500 , "user is not save in db please try again" , {success:false , data:"user is not save in db please try again"})
    }

    const accesstoken = create_admin.generateAccesstoken();

    if(!accesstoken)
    {
        return returnRespones(res,500,"accesstoken is not generated" , {success:false , data:"accesstoken is not generate"})
    }

    //you are free to add more code for the otp or more

    return returnRespones(res , 200 , "admin create successfully" , {success:true , data:accesstoken})
})


const loginAdmin = asyncHandler(async(req,res)=>{
    const {email , password} = req.body;

      if (!email || !password) {
        return returnRespones(res, 400, "please Enter email and password both", { success: false, data: "ObjectNotFound" })
    }


    const isExist = await Admin.findOne({email});

    if(!isExist)
    {
        return returnRespones(res , 400, "the name of this username account not exist" , {success:false , data:"the name of this username account not exist"})
    }

    const pass_correct = await isExist.isPasswordCorrect(password);

    if(!pass_correct)
    {
        return returnRespones(res , 400 , "please enter correct password" , {success:false  , data:"please enter correct password"})
    }

    const accesstoken = isExist.generateAccesstoken();

    if(!accesstoken)
    {
        return returnRespones(res,500,"accesstoken is not generated" , {success:false , data:"accesstoken is not generate"})
    }

    return returnRespones(res , 200 , "admin login successfully" , {success:true , data:accesstoken})

    
})

