import mongoose from "mongoose";
import {transAgent} from "../ai/transportplant.js"
import {User} from "../models/user.model.js"
import {sendMail} from "../utils/sendmail.js"

const PlantTransportSchema = new mongoose.Schema({

    userid:{
        type:String,
        required:true
    },
    location:{
        type:String,
        require:true
    },
    current_grey_plant_setup:{
        type:String,
        required:true
    },
    land_and_infrastructure:{
        type:String,
        required:true
    },
    renewable_energy_source:{
        type:String,
        required:true
    },
    water_availability:{
        type:String,
        required:true
    },
    storage_and_transport:{
        type:String,
        required:true
    },
    end_use_market:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:false
    },
    ai_procees:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

PlantTransportSchema.post("save",async function(){
    if(this.ai_procees) return;
    let message = `my company location is ${this.location}, my current grey plant setup is ${this.current_grey_plant_setup}, my current land and nfrastructure  is ${this.land_and_infrastructure}
    renewable eneryrgy source is ${this.renewable_energy_source} water availabilty is ${this.water_availability} , store and transport is ${this.storage_and_transport} and my end market user is ${this.end_use_market}`

    const data = await transAgent(message);

    this.answer = JSON.stringify(data);
    this.ai_procees = true

    const mail = await User.findById(this.userid);

    await sendMail({to:mail,subject:"✅ Your Green Hydrogen Plant Analysis Report is Ready",text:`Hello ${mail},

We’ve successfully completed the analysis of your plant setup. 🚀

Your report includes:

Roadmap for converting your existing setup into a Green Hydrogen production plant

Estimated land usage and infrastructure details

Cost breakdown and revenue projections

Expected timeline to achieve cost recovery

You can now view the full detailed analysis in your dashboard.

Thank you for trusting us with your project.
If you have any questions, feel free to reply to this email.

Best regards,
The krish Team`})

    
    return;




    
})

export const PlantTransport = mongoose.model("PlantTransport",PlantTransportSchema);