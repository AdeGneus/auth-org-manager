import { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";

const routes = Router();

routes.use("/auth", auth);
routes.use("/api/users", user);

export default routes;
