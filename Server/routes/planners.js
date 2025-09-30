// routes/planners.js
import express from 'express';
import { getPlanners, addPlanner, updatePlanner, deletePlanner } from '../controllers/plannersController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.use(protect); // Apply protection to all routes below

router.post('/', addPlanner);
router.get('/', getPlanners);
router.put('/:id', updatePlanner);
router.delete('/:id', deletePlanner);

export default router;