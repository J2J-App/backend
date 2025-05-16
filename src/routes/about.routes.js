import {Router} from "express"
import { about } from "../controllers/about.controller.js"

const aboutRouter = Router();

aboutRouter.route('/').get(about);

export default aboutRouter