import { Router } from "express";
import deserializeUser from "../middlewares/deserializeUser";
import {
  createOrganisation,
  getOrganisation,
  getOrganisations,
} from "../controllers/organisation.controller";
import { validateCreateOrganisation } from "../middlewares/validate";

const router = Router();

// Protected routes
router.use(deserializeUser);
router.get("/", getOrganisations);
router.get("/:orgId", getOrganisation);
router.post("/", validateCreateOrganisation, createOrganisation);

export default router;
