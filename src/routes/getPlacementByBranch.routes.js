import { Router } from "express";
import { getPlacementByBranch } from "../controllers/getPlacementByBranch.controller.js";

const getPlacementByBranchRouter = Router();

getPlacementByBranchRouter.route('/').post(getPlacementByBranch);

export default getPlacementByBranchRouter;