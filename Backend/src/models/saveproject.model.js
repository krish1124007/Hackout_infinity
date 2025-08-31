import mongoose from "mongoose";

const SaveProjectSchema = new mongoose.Schema({
    userid:{
        type:String
    },
    data:{
        type:String
    }
},{timestamps:true})


export const SaveProject = mongoose.model("SaveProject",SaveProjectSchema)