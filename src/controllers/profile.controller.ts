import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { prisma } from "..";

const createClientProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId, purpose } = req.body;

    if (!userId) {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "User ID is required." }));
    }
    
    if (purpose && typeof purpose !== "string") {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "Purpose must be a string." }));
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        return res.status(404).json(new ApiResponse({ statusCode: 404, data:null, message: "User not found." }));
    }

    try {
        const client = await prisma.client.create({
            data: { userId, purpose }
        });
        return res.status(201).json(new ApiResponse({ statusCode: 201, data: client, message: "Client profile created successfully." }));
    } catch (error) {
        return res.status(409).json(new ApiResponse({ statusCode: 409, data:null, message: "Client profile already exists." }));
    }
});

const updateClientProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId, purpose } = req.body;

    if (!userId) {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "User ID is required." }));
    }
    
    const client = await prisma.client.update({
        where: { userId },
        data: { purpose }
    });
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: client, message: "Client profile updated successfully." }));
});

const getClientProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "User ID is required." }));
    }
    
    const client = await prisma.client.findUnique({
        where: { userId },
        include: { user: true, projects: true }
    });
    
    if (!client) {
        return res.status(404).json(new ApiResponse({ statusCode: 404, data:null, message: "Client profile not found." }));
    }
    
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: client, message: "Client profile retrieved successfully." }));
});

const createFreelancerProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId, skills, portfolioUrl } = req.body;

    if (!userId) {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "User ID is required." }));
    }
    
    if (!Array.isArray(skills) || skills.some(skill => typeof skill !== "string")) {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "Skills must be an array of strings." }));
    }
    
    if (portfolioUrl && typeof portfolioUrl !== "string") {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "Portfolio URL must be a string." }));
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        return res.status(404).json(new ApiResponse({ statusCode: 404, data:null, message: "User not found." }));
    }

    try {
        const freelancer = await prisma.freelancer.create({
            data: { userId, skills, portfolioUrl }
        });
        return res.status(201).json(new ApiResponse({ statusCode: 201, data: freelancer, message: "Freelancer profile created successfully." }));
    } catch (error) {
        return res.status(409).json(new ApiResponse({ statusCode: 409, data:null, message: "Freelancer profile already exists." }));
    }
});

const updateFreelancerProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId, skills, portfolioUrl } = req.body;

    if (!userId) {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "User ID is required." }));
    }
    
    const freelancer = await prisma.freelancer.update({
        where: { userId },
        data: { skills, portfolioUrl }
    });
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: freelancer, message: "Freelancer profile updated successfully." }));
});

const getFreelancerProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json(new ApiResponse({ statusCode: 400, data:null, message: "User ID is required." }));
    }
    
    const freelancer = await prisma.freelancer.findUnique({
        where: { userId },
        include: { user: true, jobs: true }
    });
    
    if (!freelancer) {
        return res.status(404).json(new ApiResponse({ statusCode: 404, data:null, message: "Freelancer profile not found." }));
    }
    
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: freelancer, message: "Freelancer profile retrieved successfully." }));
});

export { createClientProfile, updateClientProfile, getClientProfile, createFreelancerProfile, updateFreelancerProfile, getFreelancerProfile };