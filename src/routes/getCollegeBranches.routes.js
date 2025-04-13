import { Router } from "express";
import { getCollegeBranches } from "../controllers/getCollegeBranches.controller.js";

const getCollegeBranchesRouter = Router();

getCollegeBranchesRouter.route('/').get(getCollegeBranches);

export default getCollegeBranchesRouter;