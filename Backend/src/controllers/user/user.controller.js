import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnRespones } from "../../utils/apiresponse.js"
import { isAccountExists } from "../../utils/isexists.js";
import { inngest } from "../../inngest/client.js";
import { OTP } from "../../models/otp.model.js"
import { Help } from "../../models/help.model.js";
import {OptimizationAgent} from "../../ai/findlandengine.js"
import { SUBCD } from "../../ai/subsb.js"
import {PlantTransport} from "../../models/planttrasport.model.js"
import {SaveProject} from "../../models/saveproject.model.js"
import {ProductMachine} from "../../models/productmachine.model.js"

const getProfile = asyncHandler(async(req,res)=>{
    

    const user = await User.findById(req.user._id).select("-password");

    if(!user)
    {
        return returnRespones(res , 400 , "user is not exist" , {success:false , data:"user is not exist"})
    }

    return returnRespones(res , 200 , "user found successfully" , {successs:true , data:user})
})

const updateProfile = asyncHandler(async(req,res)=>{
    const updateobject = req.body;

    if(Object.keys(updateobject).length == 0){
        return returnRespones( res, 400, "please send update object", {success:false , data:"please send update object"})
    }

    const user = await User.findByIdAndUpdate(req.user._id , updateobject,{new:true});

    if(!user)
    {
        return returnRespones(res , 400 , "user is not found" , {success:false , data:"user is not found"})
    }

    return returnRespones(res , 200 ,"user update successfully" , {success:true , data:user})
})

const createHelp = asyncHandler(async(req,res)=>{
    const {helpline} = req.body;
    
    if(!helpline)
    {
        return returnRespones(res,400,"please enter helpline" , {success:false , data:"please enter helpline"})
    }

    const help = await Help.create({userId:req.user._id , userdoubt:helpline})

    if(!help)
    {
        return returnRespones(res , 500,"something error to save this query please try again" , {success:false  , data:"something error to save this object please try again"})

    }

    return returnRespones(res,200,"your query is save we are update your question answer on the your register email",{success:true , data:help})
})

const findLand = asyncHandler(async(req,res)=>{
    const data = req.body;

    

    const message = `hey i have this requirement ${data}. only return json data`;

    const response = await OptimizationAgent(message);
    const policy = await SUBCD(JSON.parse(response));

    if(!response)
    {
        return returnRespones(res,500,"something problem with the Ai Agent",{success:false , data:"something problem with the ai agent"})
    }

    return returnRespones(res,200,"data fetch successfully",{success:true, data:{
        landoptimizer:JSON.parse(response),
        policy:policy
    }})


})

const savePrePlantData = asyncHandler(async(req,res)=>{
    const data = req.body;

    const save_data = await PlantTransport.create({userid:req.user._id,...data});
    if(!save_data)
    {
        return returnRespones(res,500,"something problem to save data in db",{success:false,  data:"something problem to save data in db"})

    }

    return returnRespones(res,200,"save data in db",{success:true , data:save_data})
})

const saveDataProject = asyncHandler(async(req,res)=>{
    const data = req.body;

    const newcreate = await SaveProject.create({userid:req.user._id,...data});

    returnRespones(res,200,"object create successfully",{success:true , data:newcreate})

})

const sendMachines = asyncHandler(async(req,res)=>{
    const prodcut = await ProductMachine.find({});

    return returnRespones(res,"data fetch succesfully" , {success:true , data:prodcut})
})

export {
    createHelp,
    updateProfile,
    getProfile,
    findLand,
    savePrePlantData,
    saveDataProject,
    sendMachines
}