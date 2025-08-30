import mongoose from "mongoose";

const ProductMachineSchema = new mongoose.Schema({
    userId: {
        type:String
    },
    image: {
        type: String

    },
    discription: {
        type: String

    },
    price: {
        type: String

    },
    quantity: {
        type: String
    }
}, { timestamps: true })


export const ProductMachine = mongoose.model("ProductMachine",ProductMachineSchema)