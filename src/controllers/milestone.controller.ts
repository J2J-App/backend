import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Response, Request } from "express";
import { prisma } from "..";
import jwt, {JwtPayload} from 'jsonwebtoken'

const getMilestones = asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const milestones = await prisma.milestone.findMany({
        where: {
            jobId,
        },
    });

    return res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            data: milestones,
        })
    );
});

const createMilestone = asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const { description, title, dueDate, amount, job } = req.body;
    const milestone = await prisma.milestone.create({
        data: {
            description,
            title,
            dueDate,
            amount,
            job,
            jobId,
        },
    });

    return res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            data: milestone,
            message: "Milestone created",
        })
    );
});

const updateMilestone = asyncHandler(async (req: Request, res: Response) => {
    const { milestoneId } = req.params;
    const { description, amount } = req.body;
    const milestone = await prisma.milestone.update({
        where: {
            id: milestoneId,
        },
        data: {
            description,
            amount,
        },
    });

    return res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            data: milestone,
            message: "Milestone updated",
        })
    );
});

const deleteMilestone = asyncHandler(async (req: Request, res: Response) => {
    const { milestoneId } = req.params;
    await prisma.milestone.delete({
        where: {
            id: milestoneId,
        },
    });

    return res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            data: null,
            message: "Milestone deleted",
        })
    );
});

const submitMilestone = asyncHandler(async (req: Request, res: Response) => {
})

const approveMilestone = asyncHandler(async (req: Request, res: Response) => {
})

const rejectMilestone = asyncHandler(async (req: Request, res: Response) => {
})

export { getMilestones, createMilestone, updateMilestone, deleteMilestone };
