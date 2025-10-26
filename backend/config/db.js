import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is missing. Add it to backend/.env (or load dotenv with the correct path)."
    );
  }

  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri);
    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
