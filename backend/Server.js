require('dotenv').config(); // Load environment variables

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoute = require('./authRoutes');


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(`${__dirname}/upload`));

// Routes
const router = require('./Router'); // Your main routes (ResumeBuilder + Auth when added)
app.use("/ResumeBuilder", router);
app.use('/auth', authRoute); 


// Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
