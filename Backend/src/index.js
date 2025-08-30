import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config()




connectDB().then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log(`app listed on the port ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log(`something be problem in the code the problem is ${err}`)
})