// utils/connectDB.js

const mongoose = require('mongoose');

// Database URI from environment variables
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name'; // Replace with your actual URI or use environment variable

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure if MongoDB connection fails
  }
};

// Export the connectDB function for use in other files
module.exports = connectDB;
