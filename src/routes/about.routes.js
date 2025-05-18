import {Router} from "express"
import { about } from "../controllers/about.controller.js"

const aboutRouter = Router();

aboutRouter.route('/').post(about);

export default aboutRouter