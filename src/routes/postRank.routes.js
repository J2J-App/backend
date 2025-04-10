import {Router} from "express"
import { storeRank } from "../controllers/postRank.controller.js"

const postRankRouter = Router();

postRankRouter.route('/').post(storeRank);

export default postRankRouter