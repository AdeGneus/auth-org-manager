import { Router } from "express";
import auth from "./auth.route";
import user from "./user.route";
import organisation from "./organisation.route";

const routes = Router();

routes.use("/auth", auth);
routes.use("/api/users", user);
routes.use("/api/organisations", organisation);

export default routes;
