import { Router } from "express";
import { getPlacement,getPlacementCompare } from "../controllers/placement.controller.js";

const placementRouter = Router();

placementRouter.route('/').post(getPlacement);
placementRouter.route('/getPlacement').post(getPlacementCompare);

export default placementRouter;