import { Router } from "express";
import deserializeUser from "../middlewares/deserializeUser";
import {
  getOrganisation,
  getOrganisations,
} from "../controllers/organisation.controller";

const router = Router();

// Protected routes
router.use(deserializeUser);
router.get("/", getOrganisations);
router.get("/:orgId", getOrganisation);

export default router;
