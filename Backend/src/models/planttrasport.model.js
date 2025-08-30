import mongoose from "mongoose";


const PlantTransportSchema = new mongoose.Schema({

    userid:{
        type:String,
        required:true
    },
    location:{
        lon:{
            type:String,
            required:true
        },
        let:{
            type:String,
            required:true
        }
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
    ai_procees:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

PlantTransportSchema.post("save",async function(){
    if(this.ai_procees) return;
    
})

export const PlantTransport = mongoose.model("PlantTransport",PlantTransportSchema);