import { Router } from "express";
import { getSeatMatrix,getCategoryDescription,getTotalSeats } from "../controllers/getSeatMatrix.controller.js"; 

const getCollegeBranchesRouter = Router();

getCollegeBranchesRouter.route('/').get(getSeatMatrix);
getCollegeBranchesRouter.route('/categorydescription').get(getCategoryDescription);
getCollegeBranchesRouter.route('/totalseats').get(getTotalSeats);

export default getCollegeBranchesRouter;