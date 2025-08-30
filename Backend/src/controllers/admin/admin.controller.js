import { register } from "../../utils/adminmodel.register.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnRespones } from "../../utils/apiresponse.js";
import { sendMail } from "../../utils/sendmail.js"
import { Help } from "../../models/help.model.js";



// const UserRegister = register(User);

const getAllUser = asyncHandler(async (req, res) => {
    const all_users = await User.find({});

    if (all_users.length == 0) {
        return returnRespones(res, 200, "no user found", { success: true, data: [] });
    }

    return returnRespones(res, 200, "user fetch successfully", { success: true, data: all_users })
})

const deleteAllUser = asyncHandler(async (req, res) => {
    const del = await User.deleteMany({});

    return returnRespones(res,200,"delete all user success" , {success:false , data:"delete all user success"})
})

const uploadUpdate = asyncHandler(async (req, res) => {
    const fileURL = req.file.path;
    console.log("the file url is",fileURL);
    return res.json({ message: `url is ${fileURL}` })
})

const deleteUser = asyncHandler(async(req,res)=>{
    const {id} = req.body;
    if(!id)
    {
        return returnRespones(res,400,"please enter id" , {success:false , data:"please enter id"})
    }

    const findAndDelete = await User.findByIdAndDelete(id);

    if(!findAndDelete)
    {
        return returnRespones(res,500 , "unable to delete this user" , {success:false  , data:"unable to delete this user"})
    }

    return returnRespones(res,200 , "account delete successfully" , {success:true , data:"account delete successfully"})


})

const blockUser = asyncHandler(async(req,res)=>{
    const {id} = req.body;

    if(!id)
    {
        return returnRespones(res,400,"please enter id" , {success:false , data:"please enter id"})
    }

    const user = await User.findById(id)

    user.is_active = false
    await user.save();

    return returnRespones(res,200 , "successfully we block user",{success:true , data:"user block succesfully"})


})

const mailToAll = asyncHandler(async(req,res)=>{
    const {content , subject} = req.body;

    if(!content || !subject)
    {
        return returnRespones(res , 400,"please enter content and subject" ,{success:false , data:"please enter subject and content"})
    }

    const emails = await User.distinct("email");

    await sendMail(
        {
            to:emails,
            subject:"this is example",
            text:"this is a just example",
            html:"<h1>This is a just test</h1>"
        }
    );

    return returnRespones(res , 200 , "We send the email successfully" , {success:true , data:emails})
})

const mailToPersonal = asyncHandler(async(req,res)=>{
    const {email , content , subject} = req.body;
    if(!email || !content || !subject)
    {
        return returnRespones(res , 400, "please enter all details" , {success:false , data:"please enter all details"})
    }

    await sendMail({
        to:email,
        subject,
        text:content
    })

    return returnRespones(res , 200 ,"email send done" , {success:true , data:"email send done"})
})

const displayHelp = asyncHandler(async(req,res)=>{
    const allhelps = await Help.find({});
    
    return returnRespones(res,200,"successfully fetch all doubts" , {success:true , data:allhelps})
})
export { 
    getAllUser,
    deleteAllUser,
    uploadUpdate,
    deleteUser,
    blockUser,
    mailToAll,
    mailToPersonal,
    displayHelp
 }

