import { Help } from "../../models/help.model";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnRespones } from "../../utils/apiresponse.js"


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

export {
    createHelp
}