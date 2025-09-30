// server.js
import express from 'express';
import dotenv from 'dotenv';
import http from 'http'; // <-- NEW IMPORT
import { initializeSocket } from './socket.js'; // <-- NEW IMPORT
import authRoutes from './routes/auth.js';
import lessonsRoutes from './routes/lessons.js';
import plannersRoutes from './routes/planners.js';
import chatRoutes from './routes/chat.js'; // <-- NEW IMPORT
import cors from 'cors'; // Added for proper Express/Socket.IO setup

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Apply CORS to Express routes
app.use(express.json());

// 1. Create HTTP Server
const server = http.createServer(app); 

// 2. Initialize Socket.IO
initializeSocket(server); 

// Route Mounting (Express)
app.use('/auth', authRoutes);
app.use('/lessons', lessonsRoutes);
app.use('/planners', plannersRoutes);
app.use('/chat', chatRoutes); // <-- NEW CHAT ROUTES MOUNTED

// Simple root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Chronos API is operational.' });
});

// Start the server (using the http server instance)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});