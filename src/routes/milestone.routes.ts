import express from 'express';
import  { getMilestones, createMilestone, updateMilestone, deleteMilestone } from '../controllers/milestone.controller';

const router = express.Router();

router.get("/", getMilestones);
router.post("/", createMilestone);
router.put("/:milestoneId", updateMilestone);
router.delete("/:milestoneId", deleteMilestone);

export default router;