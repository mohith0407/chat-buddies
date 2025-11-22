import { connect } from "mongoose"

const connectMongoDB=async()=>{
    try {
        const connection=await connect(process.env.MONGO_URI)
        console.log(`MongoDB connected:${connection.connection.host}`);
    } catch (error) {
        console.log(`Error:${error.message}`);
        process.exit(1);
    }
}
export default connectMongoDB