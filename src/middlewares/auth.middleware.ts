import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request{
    user?: JwtPayload;
}

export const verifyJWT = asyncHandler(
    async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
        
            if (!token) {
                throw new ApiError(401, "Unauthorized request");
            }

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET!
            ) as JwtPayload;

            req.user = decodedToken;

            next();
        } catch (error) {
            throw new ApiError(401, "Invalid or expired token");
        }
    }
);
