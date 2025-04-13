import {Router} from "express"
import { storeRank } from "../controllers/postRank.controller.js"

const getSeatMatrixRouter = Router();

getSeatMatrixRouter.route('/').get(storeRank);

export default getSeatMatrixRouter