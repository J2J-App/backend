import {Router} from "express"
import { about,photo,seat_matrix,branches } from "../controllers/about.controller.js"

const aboutRouter = Router();

aboutRouter.route('/').post(about);
aboutRouter.route('/photo').get(photo);
aboutRouter.route('/seat-matrix').post(seat_matrix);
aboutRouter.route('/branches').post(branches);


export default aboutRouter