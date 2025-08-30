import { User } from "../models/user.model.js";


export async function isAccountExists(object)
{

    const isExists = await User.findOne(object);
    if(!isExists)
    {
        return {exist:false , data:null}
    }

    return {exist:true , data:isExists}

}