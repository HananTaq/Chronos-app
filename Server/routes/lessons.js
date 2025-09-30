// routes/lessons.js
import express from 'express';
import {
    getLessons,
    addLesson,
    updateLesson,
    deleteLesson
} from '../controllers/lessonsController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Apply the 'protect' middleware to all lessons routes
router.use(protect); 

router.post('/', addLesson);
router.get('/', getLessons);
router.put('/:id', updateLesson);
router.delete('/:id', deleteLesson);

export default router;