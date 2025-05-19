import { Router } from "express";
import { getPlacement } from "../controllers/placement.controller.js";

const placementRouter = Router();

placementRouter.route('/').post(getPlacement);
placementRouter.route('/getPlacement').post(getPlacement);

export default placementRouter;