import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { validateRegister } from "../middlewares/validate";

const router = Router();

router.post("/register", validateRegister, register);

export default router;
