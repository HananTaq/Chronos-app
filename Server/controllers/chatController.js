// controllers/chatController.js
import { supabase } from '../utils/supabaseClient.js';

/**
 * Persists a new message to the Supabase 'messages' table.
 * Used by socket.js for every message sent in real-time.
 */
export const saveMessage = async (user_id, content, room_id) => { 
    // NOTE: Requires a 'messages' table with user_id, content, and room_id columns.
    
    const { data, error } = await supabase
        .from('messages')
        .insert({ 
            user_id,
            content,
            room_id
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }

    return data;
};