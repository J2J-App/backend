import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import sql from '../db/db02.js';

const getPlacementByBranch = asyncHandler(async (req, res) => {
    const { year, branch , college } = req.body;

    if (!year || isNaN(year)) {
        throw new ApiError(400, 'Invalid year. Year must be a number.');
    }

    if (year < 2022 || year > 2024) {
        throw new ApiError(400, 'Invalid year. Year must be between 2022 and 2024.');
    }

    if (!branch) {
        throw new ApiError(400, 'Branch is required.');
    }

    // college validation college can be nsut , dtu , iiitd , igdtuw , nsutw , nsute
    if (!college) {
        throw new ApiError(400, 'College is required.');
    }

    const validColleges = ['nsut', 'dtu', 'iiitd', 'igdtuw', 'nsutw', 'nsute'];

    if (!validColleges.includes(college.toLowerCase())) {
        throw new ApiError(400, 'Invalid college. College must be one of nsut, dtu, iiitd, igdtuw, nsutw, nsute.');
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