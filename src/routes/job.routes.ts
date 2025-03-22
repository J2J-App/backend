import express from "express";
import { initJob, getJob, getJobs } from "../controllers/job.controller";
const router = express.Router();

router.post("/", initJob);
router.get("/:jobId", getJob);
router.get("/", getJobs);

export default router;
