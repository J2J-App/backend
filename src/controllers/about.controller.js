import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import fs from 'fs/promises';
import path from 'path';

const about = asyncHandler(async (req, res) => {
    try {
    const { college } = req.body;
    const filePath = path.join(process.cwd(), `src/data-about/${college}-about-data.json`);
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    return res.status(200).json(
        new ApiResponse(200, data, "College branches fetched successfully")
    );

    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export { about };
