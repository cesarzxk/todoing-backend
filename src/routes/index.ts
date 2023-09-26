import { Router } from "express";

import root from "./root.routes";
import calendar from "./calendar.routes";
import tag from "./tag.routes";

export const routes = Router();

routes.use("/calendar/tag", tag);
routes.use("/calendar", calendar);
routes.use("/", root);
