import { Router } from "express";
import deserializeUser from "../middlewares/deserializeUser";
import { getOrganisation } from "../controllers/organisation.controller";

const router = Router();

// Protected routes
router.use(deserializeUser);
router.get("/", getOrganisation);

export default router;
