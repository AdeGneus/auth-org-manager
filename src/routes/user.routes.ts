import { Router } from "express";
import deserializeUser from "../middlewares/deserializeUser";
import { getUser } from "../controllers/user.controllers";

const router = Router();

// Protected routes
router.use(deserializeUser);
router.get("/:id", getUser);

export default router;
