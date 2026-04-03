const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

// Set DNS servers to avoid SRV lookup issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with DNS fix
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/grc_platform";
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(mongoURI, options);
    console.log("✅ MongoDB Connected");
    
    // Test the connection
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
    
    // If Atlas fails, try local MongoDB
    if (process.env.MONGODB_URI && error.message.includes('querySrv')) {
      console.log("🔄 Atlas DNS failed, trying local MongoDB...");
      try {
        await mongoose.connect("mongodb://localhost:27017/grc_platform", options);
        console.log("✅ Connected to local MongoDB");
      } catch (localError) {
        console.error("❌ Local MongoDB also failed:", localError);
        console.log("🔄 Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
      }
    } else {
      console.log("🔄 Retrying connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    }
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/assets", require("./routes/assetRoutes"));
app.use("/api/risks", require("./routes/riskRoutes"));
app.use("/api/controls", require("./routes/controlRoutes"));
app.use("/api/treatments", require("./routes/treatmentRoutes"));
app.use("/api/config", require("./routes/configRoutes"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
