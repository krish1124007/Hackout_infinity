import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const MachineSellerSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        uniqe:true
    },
    user_type:{
        type:String,
        default:"Machine"
    },
    password:{
        type:String,
        required:true
    },
    contact_number:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }
},{timestamps:true})

MachineSellerSchema.pre("save", async function (next) {
    try {

        if (!this.isModified("password")) {
            return next()
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        console.log(error);
        return next(error)
    }

})

MachineSellerSchema.methods.isPasswordCorrent = async function(password)
{
    return await bcrypt.compare(password , this.password)
}


MachineSellerSchema.methods.generateAccessToken = function()
{
    return jwt.sign({_id:this._id,user_type:this.user_type},process.env.JWT_SECERATE_TOKEN , {expiresIn:process.env.JWT_EXPIRE})
}

export const MachineSeller = mongoose.model("MachineSeller" , MachineSellerSchema)