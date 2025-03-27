import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import sql from '../db/db02.js';

const getPlacementByBranch = asyncHandler(async (req, res) => {
    const { year, branch , college } = req.body;

    if (!year || isNaN(year)) {
        throw new ApiError(400, 'Invalid year. Year must be a number.');
    }

    if (!branch) {
        throw new ApiError(400, 'Branch is required.');
    }

    if (!college) {
        throw new ApiError(400, 'College is required.');
    }

    const branchInUpperCase = branch.toUpperCase();

    const query = `SELECT * FROM ${college}_${year} WHERE branch = '${branchInUpperCase}'`;

    let result = await sql.query(query);

    result = result.map((row) => ({
        ...row,
        year: year,
        branch: branchInUpperCase,
        college : college
    }));

    return res.status(200).json(
        new ApiResponse(200, result, 'Placements fetched successfully')
    );
});

export {getPlacementByBranch};