// middleware/authMiddleware.js
import { supabase } from '../utils/supabaseClient.js';

export const protect = async (req, res, next) => {
    let token;

    // Check for the token in the 'Authorization' header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, token missing or improperly formatted' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Not authorized, token invalid or expired' });
        }

        req.user = user;
        req.token = token;
        
        await supabase.auth.setSession({ access_token: token, refresh_token: req.user.aud });

        next();
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(401).json({ error: 'Not authorized, token validation failed' });
    }
};

// 🌟 NEW Socket.IO Middleware
export const protectSocket = async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: Token missing'));
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return next(new Error('Authentication error: Token invalid or expired'));
        }

        socket.user = user;
        
        await supabase.auth.setSession({ access_token: token, refresh_token: user.aud });

        next();
    } catch (error) {
        console.error('Socket Auth check error:', error);
        next(new Error('Authentication error: Token validation failed'));
    }
};