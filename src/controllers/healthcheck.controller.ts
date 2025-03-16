import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Response, Request } from "express";

const healthcheck = asyncHandler(async (req: Request, res: Response) => {
    const a = "All good.";
    const response = new ApiResponse({
        statusCode: 200,
        data: a,
        message: "Everything is fine!"
    });
    return res
        .status(response.statusCode)
        .json(response);
});

export { healthcheck };