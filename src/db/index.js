import mongoose from "mongoose";

const connectDB=async()=>{
  await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`)
}

export default connectDB
