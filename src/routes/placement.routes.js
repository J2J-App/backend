import { Router } from "express";
import { getPlacement } from "../controllers/placement.controller.js";

const placementRouter = Router();

placementRouter.route('/').post(getPlacement);

export default placementRouter;