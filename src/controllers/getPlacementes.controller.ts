import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Response, Request } from "express";

// This fill will contains six functions, each responsible for fetching placement 
// data for an individual college
// Placement data for each college is stored in separate tables
// Each table contains placement records for 2022 2023 2024
// Each function will
// Query the respective college placement table
// Return placement statistics for available years
// If no data is found, return No placement data available
// Ensure the API functions correctly using Postman or any preferred API testing tool

// IMORTANT PLEASE ADD LITTLE BITS OF COMMENTS TO THE CODE
// FELL FREE TO REMOVE THESE COMMENTS

const getIGDTUWPlacements = asyncHandler(async (req: Request, res: Response) => {
    // Fetch IGDTUW placement data from the database
});

const getNSUTPlacements = asyncHandler(async (req: Request, res: Response) => {
    // Fetch NSUT placement data from the database
});

const getDTUPlacements = asyncHandler(async (req: Request, res: Response) => {
    // Fetch DTU placement data from the database
});

const getIIITDPlacements = asyncHandler(async (req: Request, res: Response) => {
    // Fetch IIITD placement data from the database
});

const getNSUTEastPlacements = asyncHandler(async (req: Request, res: Response) => {
    // Fetch NSUT East Campus placement data from the database
});

const getNSUTWestPlacements = asyncHandler(async (req: Request, res: Response) => {
    // Fetch NSUT West Campus placement data from the database
});

export { 
    getIGDTUWPlacements, 
    getNSUTPlacements, 
    getDTUPlacements, 
    getIIITDPlacements, 
    getNSUTEastPlacements, 
    getNSUTWestPlacements 
};
