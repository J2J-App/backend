import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {Request, Response} from "express"
import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";

const generateAccessAndRefreshTokens = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const generateAccessToken = () => {
            return jwt.sign(
                { userId: user.id },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "10d" }
            );

            // return jwt.sign(
            //     { userId: user.id },
            //     process.env.ACCESS_TOKEN_SECRET!,
            //     { expiresIn: '1h' })
        };

        const generateRefreshToken = () => {
            return jwt.sign(
                { userId: user.id },
                process.env.REFRESH_TOKEN_SECRET!
            );
        };

        const accessToken = generateAccessToken();
        const refreshToken = generateRefreshToken();
        return { accessToken, refreshToken };
    } catch (error) {
        const err = error as Error;
        throw new ApiError(
            500,
            "Error generating tokens",
            [err.message],
            err.stack
        );
    }
};

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        const user = await prisma.user.findFirst({
            where: {
                id: (decodedToken as JwtPayload).userId,
            },
        });

        if (!user) {
            throw new ApiError(400, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user.id);

        return res.status(200).json(
            new ApiResponse({
                statusCode: 201,
                data: { accessToken, refreshToken },
                message: "Access token refreshed",
            })
        );
    } catch (error) {
        const errorMessage =
            (error as Error).message || "Invalid refresh token";
        throw new ApiError(400, errorMessage);
    }
});

const signIn = asyncHandler(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    if (!name) {   
        throw new ApiError(400, "Name is required");
    }

    // Check if the user exists
    let user = await prisma.user.findUnique({
        where: { email: email },
        include: {
            client: true,
            freelancer: true,
        }
    });

    if (user) {

        // Generate tokens and log in the user
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

        const profileExists = !!user.client || !!user.freelancer


        const userResponse = {
            ...user,
            accessToken,
            refreshToken,
            profileExists
        } as { [key: string]: any };


        return res.status(200).json(
            new ApiResponse<typeof userResponse>({
                statusCode: 200,
                data: userResponse,
                message: "User logged in successfully",
            })
        );
    } else {

        const newUser = await prisma.user.create({
            data: { name: name, email: email},
        });

        if (!newUser) {
            throw new ApiError(501, "Error in creating user");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser.id);

        const profileExists = false;

        const userResponse = {
            ...newUser,
            accessToken,
            refreshToken,
            profileExists
        } as { [key: string]: any };

        return res.status(201).json(
            new ApiResponse<typeof userResponse>({
                statusCode: 201,
                data: userResponse,
                message: "User created and logged in successfully",
            })
        );
    }
});


export { refreshAccessToken, signIn };