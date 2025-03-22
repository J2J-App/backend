import express from "express";
import { 
    createClientProfile, 
    updateClientProfile, 
    getClientProfile 
} from "../controllers/profile.controller";

const router = express.Router();

router.post("/", createClientProfile);
router.put("/", updateClientProfile);
router.get("/:userId", getClientProfile);

export default router;
