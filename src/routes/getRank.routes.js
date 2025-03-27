import { Router } from "express";
import { getRank } from "../controllers/getRank.controller.js";

const getRankRouter = Router();

getRankRouter.route('/').post(getRank);

export default getRankRouter;