import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import sql from '../db/db03.js';

const storeRank = asyncHandler(async (req, res) => {
    const { rank } = req.body;

    if (!rank) {
        throw new ApiError(400, 'Rank is required.');
    }

    if (isNaN(rank)) {
        throw new ApiError(400, 'Invalid rank. Rank must be a number.');
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const checkQuery = `SELECT * FROM ranks WHERE rank = $1`;
    const existingRank = await sql.query(checkQuery, [rank]);

    let result;

    if (existingRank.length > 0) {
        const updateQuery = `
            UPDATE ranks 
            SET date = $1, no_of_record = no_of_record + 1 
            WHERE rank = $2
            RETURNING *
        `;
        result = await sql.query(updateQuery, [currentDate, rank]);
    } else {
        const insertQuery = `
            INSERT INTO ranks (rank, date, no_of_record) 
            VALUES ($1, $2, 1) 
            RETURNING *
        `;
        result = await sql.query(insertQuery, [rank, currentDate]);
    }

    return res.status(200).json(
        new ApiResponse(200, result[0], 'Rank stored successfully')
    );
});

export {storeRank};