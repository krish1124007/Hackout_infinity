import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    user_type:{
        type:String,
        default:"Admin"
    }
},{timestamps:true})

AdminSchema.pre("save", async function(next)
{
    if(!this.isModified("password"))
    {
        return next();
    }

    this.password = await bcrypt.hash(this.password , 10);
    next();
})

AdminSchema.methods.generateAccesstoken = function()
{
    return jwt.sign(
        {
            _id:this._id,
            user_type:this.user_type
        },
        process.env.JWT_SECERATE_TOKEN,
        {
            expiresIn:process.env.JWT_EXPIRE
        }
    )
}

AdminSchema.methods.isPasswordCorrect = function(password)
{
    return bcrypt.compare(password , this.password)
}

export const Admin = mongoose.model("Admin" , AdminSchema)