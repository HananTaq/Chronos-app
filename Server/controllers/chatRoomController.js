// controllers/chatRoomController.js
import { supabase } from '../utils/supabaseClient.js';

// --- GET (GET /chat/rooms) ---
export const getRooms = async (req, res) => {
    // RLS must be used on 'rooms' table to filter based on auth.uid().
    const { data: rooms, error } = await supabase
        .from('rooms')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(rooms);
};

// --- POST (POST /chat/rooms) ---
export const createRoom = async (req, res) => {
    const user_id = req.user.id; 
    const { name } = req.body;

    const { data, error } = await supabase
        .from('rooms')
        .insert({ 
            name,
            creator_id: user_id
        })
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    
    // In a production app, you would also add the user to a 'room_members' table here.
    
    res.status(201).json({ message: "Room created successfully", room: data });
};