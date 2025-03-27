import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import sql from '../db/db03.js';

const getRank = asyncHandler(async (req, res) => {
    const { percentile , year} = req.body;

    const query = `SELECT * FROM data_${year} WHERE `;
});

export {getRank};