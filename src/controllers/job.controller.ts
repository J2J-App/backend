import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Response, Request } from "express";

import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";


const initJob = asyncHandler(async (req: Request, res: Response) => {

    const { title, description, freelancerId, milestones } = req.body;
    const clientId = (req.user as JwtPayload).userId;

    const job = await prisma.job.create({
        data: {
            title,
            description,
            clientId,
            freelancerId,
        },
    });

    milestones.forEach(async (milestone:any) => {
        await prisma.milestone.create({
            data: {
                ...milestone,
                jobId: job.id,
            },
        });
    });
    
})

const getJob = asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const job = await prisma.job.findUnique({
        where: {
            id: jobId,
        },
        include: {
            milestones: true,
        },
    });

    return res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            data: job,
            message: "Job fetched",
        })
    )
})

const getJobs = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await prisma.job.findMany({
        include: {
            milestones: true,
        },
    });

    return res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            data: jobs,
            message: "Jobs fetched",
        })
    )
})

const rejectJob = asyncHandler(async (req: Request, res: Response) => {
})

const acceptJob = asyncHandler(async (req: Request, res: Response) => {
})

const suggestJob = asyncHandler(async (req: Request, res: Response) => {
})

const completeJob = asyncHandler(async (req: Request, res: Response) => {
})



export { initJob, getJob, getJobs };