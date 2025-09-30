// routes/chat.js
import express from 'express';
import { getRooms, createRoom } from '../controllers/chatRoomController.js';
import { getMessageHistory } from '../controllers/chatMessageController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Apply the Express 'protect' middleware to secure all chat REST routes
router.use(protect); 

// Room Endpoints: /chat/rooms
router.get('/rooms', getRooms); 
router.post('/rooms', createRoom); 

// Message History Endpoint: /chat/messages/:roomId
router.get('/messages/:roomId', getMessageHistory); 

export default router;