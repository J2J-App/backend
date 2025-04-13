import { Router } from "express";
import { getCollegeData } from "../controllers/getCollegeData.controller.js";

const getCollegeDataRouter = Router();

getCollegeDataRouter.route('/').get(getCollegeData);

export default getCollegeDataRouter;