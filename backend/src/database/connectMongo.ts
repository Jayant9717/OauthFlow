import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const mongoURI = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectMongo;
