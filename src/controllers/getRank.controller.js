import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import sql from '../db/db03.js';

const getRank = asyncHandler(async (req, res) => {
    const { percentile, year } = req.body;

    if (!year || isNaN(year)) {
        throw new ApiError(400, 'Invalid year. Year must be a number.');
    }

    if (year < 2022 || year > 2024) {
        throw new ApiError(400, 'Invalid year. Year must be between 2022 and 2024.');
    }

    // percentile validation percentile can be 0 to 100 can be float or int
    if (!percentile || isNaN(percentile)) {
        throw new ApiError(400, 'Invalid percentile. Percentile must be a number between 0 and 100.');
    }

    if (percentile < 0 || percentile > 100) {
        throw new ApiError(400, 'Invalid percentile. Percentile must be between 0 and 100.');
    }

    const parsedPercentile = parseFloat(percentile);
    const parsedYear = parseInt(year, 10);

    if (isNaN(parsedPercentile) || parsedPercentile < 0 || parsedPercentile > 100) {
        throw new ApiError(400, "Percentile must be a number between 0 and 100");
    }

    if (isNaN(parsedYear)) {
        throw new ApiError(400, "Year must be a valid number");
    }

    try {
        const exactMatchQuery = 
            `SELECT * FROM data_${parsedYear} WHERE percentile = $1 LIMIT 1`;
        const exactMatchResult = await sql.query(exactMatchQuery, [parsedPercentile]);

        if (exactMatchResult.length > 0) {
            return res.status(200).json(
                new ApiResponse(200, {
                    type: 'exact',
                    data: exactMatchResult[0]
                }, "Exact percentile match found")
            );
        }

        const lowerBoundQuery = 
            `SELECT * FROM data_${parsedYear} WHERE percentile <= $1 ORDER BY percentile DESC LIMIT 1`;
        const lowerBoundResult = await sql.query(lowerBoundQuery, [parsedPercentile]);

        const upperBoundQuery = 
            `SELECT * FROM data_${parsedYear} WHERE percentile >= $1 ORDER BY percentile ASC LIMIT 1`;
        const upperBoundResult = await sql.query(upperBoundQuery, [parsedPercentile]);

        if (lowerBoundResult.length === 0 || upperBoundResult.length === 0) {
            throw new ApiError(404, `No data found for percentile ${parsedPercentile} in year ${parsedYear}`);
        }

        res.status(200).json(
            new ApiResponse(200, {
                type: 'range',
                lower_bound: lowerBoundResult[0],
                upper_bound: upperBoundResult[0],
                requested_percentile: parsedPercentile
            }, "Approximate percentile match found")
        );
    } catch (error) {
        console.error('Error in getRank:', error);

        if (error instanceof ApiError) {
            throw error;
        }

        console.error('Original error:', error);
        throw new ApiError(500, `Internal server error: ${error.message}`);
    }
});

export { getRank };