import express from "express";
import { 
    createFreelancerProfile, 
    updateFreelancerProfile, 
    getFreelancerProfile 
} from "../controllers/profile.controller";

const router = express.Router();

router.post("/", createFreelancerProfile);
router.put("/", updateFreelancerProfile);
router.get("/:userId", getFreelancerProfile);

export default router;
