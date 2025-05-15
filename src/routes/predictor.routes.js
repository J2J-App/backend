import { Router } from "express";
import { getBranches } from "../controllers/predictor.controller.js";

const predictorRouter = Router();

predictorRouter.route('/').post(getBranches);

export default predictorRouter;