import { groq } from "../config/groq.js";

async function LandFinderAndOptimizer(usermessage) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `you get the some data from the user the data you get like this   location:{
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
    thi type of data user give you know you are process the data and make a plan to conert it plant to into the green hydrogen production plant so give the roadmap and also give the how many landcutting how many cost are we take how many resvunes generate and after how much time we complete the cost by the revinew in this plant all data     
    `

      },
      {
        role: "user",
        content: usermessage
      }
    ],
    model: "deepseek-r1-distill-llama-70b",
    
    temperature: 1.2,
    max_tokens: 8671,   // use max_tokens instead of max_completion_tokens
    top_p: 0.95,
    response_format:{type:"json_object"},
    stream: false       // disable streaming for easier handling
  });

  return chatCompletion;
}