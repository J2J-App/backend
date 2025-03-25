import { Router } from "express";
import { getBranches } from "../controllers/getBranches.controller.js";

const getBranchesRouter = Router();

getBranchesRouter.route('/').post(getBranches);

export default getBranchesRouter;