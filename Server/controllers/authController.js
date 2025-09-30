// authController.js
import { supabase } from "../utils/supabaseClient.js";

// The existing register function
export const register = async (req, res) => {
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
    });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Registration successful", data });
};

// 🌟 New Login Function
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Use the signInWithPassword method
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(401).json({ error: error.message }); // Use 401 Unauthorized for login errors
    res.json({ message: "Login successful", data });
};

// 🌟 New Forgot Password Function
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    // Use the resetPasswordForEmail method
    // Supabase will send a password reset link to the user's email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        // You can specify a redirect URL here after the user clicks the link in their email
        // redirectTo: 'YOUR_FRONTEND_RESET_PASSWORD_URL',
    });

    if (error) return res.status(400).json({ error: error.message });

    // Note: It's a security best practice to return a success message 
    // regardless of whether the email exists to prevent user enumeration.
    res.json({ 
        message: "If a matching account was found, a password recovery link has been sent to your email.", 
        data 
    });
};