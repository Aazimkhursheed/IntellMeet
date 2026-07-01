import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intellmeet'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Warning: MongoDB is not running or unreachable. The server will run, but database operations will fail.');
  }
};

export default connectDB;
