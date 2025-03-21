import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Response, Request } from "express";


//This function retrieves placement data based on the branch and college name*
//provided in the request
// Fetch placement data for 2022 2023 2024
// If no data is found, return No placement data available for the given criteria
// Ensure the API is working correctly using Postman or any other API testing tool

// IMORTANT PLEASE ADD LITTLE BITS OF COMMENTS TO THE CODE
// FELL FREE TO REMOVE THESE COMMENTS

const getPlacementByBranch = asyncHandler(async (req: Request, res: Response) => {
    const { collegeName, branchName } = req.body;
    if (!collegeName || !branchName) {
        return new ApiResponse({
            statusCode: 400,
            data: null,
            message: "Please provide both college name and branch name.",
        });
    }
});

export { getPlacementByBranch };