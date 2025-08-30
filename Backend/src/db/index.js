import mongoose from "mongoose";



export async function connectDB()
{
    try {
        const response = await mongoose.connect(process.env.DB_URL);
        console.log('DB connect succuessfully');
    } catch (error) {
        console.log(`error generate while the connect db the error is:${error}`);
    }
}