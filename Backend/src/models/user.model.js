import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        uniqe:true
    },
    user_type:{
        type:String,
        default:"User"
    },
    email: {
        type: String,
        required: true,
        uniqe: true
    },
    password: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
    },
    profile:{
        type:String
    }
}, { timestamps: true })


UserSchema.pre("save", async function (next) {
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

UserSchema.methods.isPasswordCorrent = async function(password)
{
    return await bcrypt.compare(password , this.password)
}


UserSchema.methods.generateAccessToken = function()
{
    return jwt.sign({_id:this._id,user_type:this.user_type},process.env.JWT_SECERATE_TOKEN , {expiresIn:process.env.JWT_EXPIRE})
}



export const User = mongoose.model("User", UserSchema)