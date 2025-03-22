import {Router} from "express"
import { refreshAccessToken, signIn} from "../controllers/user.controller"
import { verifyJWT } from "../middlewares/auth.middleware"

const router = Router()


router.route("/signIn").post(signIn)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/update-push-token").post(verifyJWT)

export default router