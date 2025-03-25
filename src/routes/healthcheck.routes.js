import {Router} from "express"
import { healthcheck } from "../controllers/healthcheck.controller.js"

const healthcheckRouter = Router();

healthcheckRouter.route('/').get(healthcheck);

export default healthcheckRouter