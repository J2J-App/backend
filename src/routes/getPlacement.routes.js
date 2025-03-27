import { Router } from "express";
import { getPlacement } from "../controllers/getPlacement.controller.js";

const getPlacementRouter = Router();

getPlacementRouter.route('/').post(getPlacement);

export default getPlacementRouter;