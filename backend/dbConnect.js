// const mongoose=require("mongoose")
// mongoose.connect("mongodb://127.0.0.1/ResumeBuilder")
// var db=mongoose.connection
// db.on("error",console.error.bind("error"))
// db.once("open",function(){
//     console.log("connection successfull");
// })

// module.exports=db;


require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Optionally export mongoose or the connection
module.exports = mongoose;

