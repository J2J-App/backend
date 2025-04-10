import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import sql from '../db/db02.js';

const getPlacement = asyncHandler(async (req, res) => {
    try {
        const { year } = req.body;

        // adding year validation year can be 2022 , 2023, 2024
        if (!year || isNaN(year)) {
            throw new ApiError(400, 'Invalid year. Year must be a number.');
        }

        if (year < 2022 || year > 2024) {
            throw new ApiError(400, 'Invalid year. Year must be between 2022 and 2024.');
        }
        
        const query_nsut = `SELECT * FROM nsut_${year}`;
        const query_dtu = `SELECT * FROM dtu_${year}`;
        const query_iiitd = `SELECT * FROM iiitd_${year}`;
        const query_igdtuw = `SELECT * FROM igdtuw_${year}`;

        let result_nsut = await sql.query(query_nsut);
        let result_dtu = await sql.query(query_dtu);
        let result_iiitd = await sql.query(query_iiitd);
        let result_igdtuw = await sql.query(query_igdtuw);

        result_nsut = result_nsut.map((item) => ({
            ...item,
            college: 'NSUT',
            year: year
        }));

        result_dtu = result_dtu.map((item) => ({
            ...item,
            college: 'DTU',
            year: year
        }));

        result_iiitd = result_iiitd.map((item) => ({
            ...item,
            college: 'IIITD',
            year: year
        }));

        result_igdtuw = result_igdtuw.map((item) => ({
            ...item,
            college: 'IGDTUW',
            year: year
        }));

        const final_result = [...result_nsut, ...result_dtu, ...result_iiitd, ...result_igdtuw];

        return res.status(200).json(
            new ApiResponse(200, final_result, 'Placements fetched successfully')
        );
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export { getPlacement };
