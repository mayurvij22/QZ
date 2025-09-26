// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const voteRoutes = require('./routes/voteRoutes');
const adminRoute  = require("./routes/adminRoutes")
const errorHandler = require('./middleware/errorMiddleware');


const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/votes', voteRoutes);
app.use("/api/admin",adminRoute)

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler (last)
app.use(errorHandler); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serve r running on port ${PORT}`));
