import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {

    try {
        const  conn = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("Connect" + conn.connection.host)
    } catch (err) {
        console.log(err)
        process.exit(1);
    }
}