const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/db/db');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
