import {Router} from "express"
import { about,photo,seat_matrix } from "../controllers/about.controller.js"

const aboutRouter = Router();

aboutRouter.route('/').post(about);
aboutRouter.route('/photo').get(photo);
aboutRouter.route('/seat-matrix').post(seat_matrix);


export default aboutRouter