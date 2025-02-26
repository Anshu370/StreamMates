const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/roomRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// // Test route
// app.get('/test', (req, res) => {
//   res.json({ message: 'Server is running' });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Handle 404
app.use((req, res) => {
  console.log('404 for:', req.method, req.path);
  res.status(404).json({ message: 'Page not found' });
});

const PORT = process.env.PORT || 5000;

// // Update MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
// const connectDB = async () => {
//   try{
//     const MONGODB_INSTANCE = await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected");
//   }
//   catch(err){
//     console.log("MongoDB Connection Error:", err);
//     process.exit(1);
//   }
// }


// connectDB()
// .then(() =>{
//   app.listen(process.env.PORT || 8888, () => {
//     console.log(`Server running on port ${process.env.PORT || 8888}`);
//   })
// })
// .catch((err) => {
//   console.log("MongoDB Connection Error:", err);
//   process.exit(1);
// })
