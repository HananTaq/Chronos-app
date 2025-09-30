// auth.js
import express from "express";
import { register, login, forgotPassword } from "../controllers/authController.js"; // <-- login and forgotPassword are already imported

const router = express.Router();

router.post("/register", register);
router.post("/login", login); // <-- Add this line
router.post("/forgot-password", forgotPassword); // <-- Add this line

export default router;