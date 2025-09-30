// controllers/chatMessageController.js
import { supabase } from '../utils/supabaseClient.js';

// --- GET (GET /chat/messages/:roomId) ---
export const getMessageHistory = async (req, res) => {
    const { roomId } = req.params; 

    const { data: messages, error } = await supabase
        .from('messages')
        .select(`
            id, 
            content, 
            created_at, 
            user_id, 
            profile:user_id(name) // Assuming a join to a 'profiles' table for sender name
        `) 
        .eq('room_id', roomId) 
        .order('created_at', { ascending: true }) 
        .limit(100); 

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(messages);
};