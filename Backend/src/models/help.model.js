import mongoose from "mongoose"
import { inngest } from "../inngest/client.js"

const HelpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userdoubt: {
        type: String,
        required: true
    },
    solved: {
        type: Boolean,
        default: false
    },
    answer: {
        type: String,
        required: false
    }
}, { timestamps: true })

HelpSchema.post("save", async function () {
   if (this.solved) return;
   console.log("inngest function triger")
   await inngest.send({
        name: "aiprocess", data: {

            queryid: this._id,
            userid: this.userId,
            query: this.userdoubt

        }
    })
    console.log("triger end")

})

export const Help = mongoose.model("Help", HelpSchema) 