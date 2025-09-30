// controllers/lessonsController.js
import { supabase } from '../utils/supabaseClient.js';

// --- GET (GET /lessons) ---
export const getLessons = async (req, res) => {
    // This function should fetch the list of lessons.
    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*') 
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(lessons);
};

// --- POST (POST /lessons) ---
export const addLesson = async (req, res) => {
    const user_id = req.user.id; 
    const { title, description } = req.body;

    // This function should create a new lesson entry.
    const { data, error } = await supabase
        .from('lessons')
        .insert({ 
            user_id,
            title, 
            description
        })
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Lesson created successfully", lesson: data[0] });
};

// --- PUT (PUT /lessons/:id) ---
export const updateLesson = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // This function should update an existing lesson.
    const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    if (data.length === 0) {
        return res.status(404).json({ message: "Lesson not found or access denied." });
    }

    res.status(200).json({ message: "Lesson updated successfully", lesson: data[0] });
};

// --- DELETE (DELETE /lessons/:id) ---
export const deleteLesson = async (req, res) => {
    const { id } = req.params;

    // This function should delete a lesson.
    const { error, count } = await supabase
        .from('lessons')
        .delete({ count: 'exact' })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    if (count === 0) {
        return res.status(404).json({ message: "Lesson not found or access denied." });
    }

    res.status(204).send();
};