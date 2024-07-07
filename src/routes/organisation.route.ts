import { Router } from "express";
import deserializeUser from "../middlewares/deserializeUser";
import {
  addUser,
  createOrganisation,
  getOrganisation,
  getOrganisations,
} from "../controllers/organisation.controller";
import {
  validateAddUserToOrganisation,
  validateCreateOrganisation,
} from "../middlewares/validate";

const router = Router();

// Protected routes
router.use(deserializeUser);
router.get("/", getOrganisations);
router.get("/:orgId", getOrganisation);
router.post("/", validateCreateOrganisation, createOrganisation);
router.post("/:orgId/users", validateAddUserToOrganisation, addUser);

export default router;
