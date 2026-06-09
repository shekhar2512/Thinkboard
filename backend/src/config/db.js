import mongoose from "mongoose";

export const connectDB = async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_URI,
      );
      console.log("Connected to MongoDB successfully");

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); //exit with failure
    }
};

// mongodb+srv://shekharbaheliya4000_db_user:Test12345@cluster0.n4sehhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0