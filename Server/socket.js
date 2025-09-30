// socket.js
import { Server } from 'socket.io';
import { protectSocket } from './middleware/authMiddleware.js'; 
import { saveMessage } from './controllers/chatController.js'; 

/**
 * Initializes and configures the Socket.IO server for chat functionality.
 * @param {import('http').Server} httpServer The Node.js HTTP server instance created from Express.
 */
export const initializeSocket = (httpServer) => {
    
    // Initialize Socket.IO and attach it to the HTTP server.
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || '*', 
            methods: ["GET", "POST"]
        }
    });

    // 1. Apply Authentication Middleware (protectSocket)
    io.use(protectSocket); 

    // 2. Main Connection Handler
    io.on('connection', (socket) => {
        const userId = socket.user.id;
        const username = socket.user.user_metadata.name || `User-${userId.substring(0, 4)}`;
        
        console.log(`Socket connected: ${username} (${socket.id})`);
        
        // --- Event: Client requests to join a room ---
        socket.on('joinRoom', (roomId, callback) => {
            if (!roomId) return callback && callback({ error: "Room ID is required" });

            socket.join(roomId);
            console.log(`${username} joined room: ${roomId}`);
            
            // Notify room members
            io.to(roomId).emit('userJoined', { username, userId });
            
            if (callback) {
                callback({ status: 'success', roomId, message: `Joined room ${roomId}` });
            }
        });

        // --- Event: Client sends a new message ---
        socket.on('sendMessage', async (msgPayload, callback) => {
            const { content, roomId } = msgPayload; 
            
            if (!content || content.trim() === '' || !roomId) {
                return callback && callback({ error: 'Message content or room ID missing' });
            }

            // Check: Is the user actually subscribed to the room via this socket connection?
            if (!socket.rooms.has(roomId)) {
                return callback && callback({ error: `Not subscribed to room: ${roomId}` });
            }

            try {
                // Persist message to Supabase DB (using the chatController utility)
                const savedMessage = await saveMessage(userId, content, roomId); 

                // Prepare the message for real-time broadcast
                const messageToSend = {
                    id: savedMessage.id,
                    content: savedMessage.content,
                    room_id: savedMessage.room_id,
                    user_id: userId,
                    username: username, 
                    created_at: savedMessage.created_at,
                };
                
                // Broadcast the message to all clients in the specific room
                io.to(roomId).emit('messageReceived', messageToSend);

                if (callback) callback({ success: true, message: messageToSend });

            } catch (error) {
                console.error('Error saving or broadcasting message:', error);
                if (callback) callback({ error: 'Failed to send message' });
            }
        });

        // --- Event: Client disconnection ---
        socket.on('disconnect', () => {
            socket.rooms.forEach(roomId => {
                if (roomId !== socket.id) { 
                    io.to(roomId).emit('userLeft', { username, userId });
                }
            });
            console.log(`Socket disconnected: ${username} (${socket.id})`);
        });
    });

    console.log('Socket.IO initialized and ready for chat connections.');
    return io;
};