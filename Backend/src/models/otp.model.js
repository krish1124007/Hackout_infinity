import mongoose from "mongoose";

const OtpSchem = new mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{timestamps:true})



export const OTP = mongoose.model("OTP" , OtpSchem);