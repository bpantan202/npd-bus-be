import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { login, register, logout, getMe } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);


export default router;
