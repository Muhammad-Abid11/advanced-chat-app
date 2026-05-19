import mongoose from "mongoose";
import { CONNECTION_STRING } from "../constants/env.constant.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(CONNECTION_STRING)
        console.log('Database connected Successfully....', connect.connection.host)
    } catch (error) {
        console.log("error", error)
        process.exit(1)
    }
}
export default connectDB;