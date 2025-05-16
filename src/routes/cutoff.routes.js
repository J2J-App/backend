import { Router } from "express";
import { predictor,cutoff } from "../controllers/cutoff.controller.js";

const cutoffRouter = Router();

cutoffRouter.route('/predictor').post(predictor);
cutoffRouter.route('/').post(cutoff);

export default cutoffRouter;