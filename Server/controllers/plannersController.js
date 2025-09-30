// controllers/plannersController.js
import { supabase } from '../utils/supabaseClient.js';

// --- GET (GET /planners) ---
export const getPlanners = async (req, res) => {
    const { data: planners, error } = await supabase
        .from('planners')
        .select('*, lesson:lesson_id(title)') 
        .order('due_date', { ascending: true })
        .order('priority', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(planners);
};

// --- POST (POST /planners) ---
export const addPlanner = async (req, res) => {
    const user_id = req.user.id; 
    const { title, description, due_date, priority, status, type, lesson_id } = req.body;

    const { data, error } = await supabase
        .from('planners')
        .insert({ 
            user_id,
            title, 
            description, 
            due_date, 
            priority: priority || 'medium',
            status: status || 'pending',
            type,
            lesson_id
        })
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Task created successfully", task: data[0] });
};

// --- PUT (PUT /planners/:id) ---
export const updatePlanner = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
        .from('planners')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    if (data.length === 0) {
        return res.status(404).json({ message: "Task not found or access denied." });
    }

    res.status(200).json({ message: "Task updated successfully", task: data[0] });
};

// --- DELETE (DELETE /planners/:id) ---
export const deletePlanner = async (req, res) => {
    const { id } = req.params;

    const { error, count } = await supabase
        .from('planners')
        .delete({ count: 'exact' })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    if (count === 0) {
        return res.status(404).json({ message: "Task not found or access denied." });
    }

    res.status(204).send();
};