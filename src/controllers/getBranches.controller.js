import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import sql from '../db/db01.js';

const getBranches = asyncHandler(async (req, res) => {
    try {
        const {rank, domicile, category} = req.body;
        if(!rank){
            throw new ApiError(400, 'Rank is required');
        }

        if(!domicile){
            throw new ApiError(400, 'Domicile is required');
        }

        if(!category){
            throw new ApiError(400, 'Category is required');
        }

        if(isNaN(Number(rank))){
            throw new ApiError(400, 'Rank should be a number');
        }

        if(rank < 0){
            throw new ApiError(400, 'Rank should be a positive number');
        }

        if(domicile !== 'Delhi' && domicile !== 'Outside Delhi'){
            throw new ApiError(400, 'Domicile should be either Delhi or Outside Delhi');
        }

        const domicileInAbreviation = domicile === 'Delhi' ? 'D' : 'OD';

        const categoryMap = {
            'General': 'GEN',
            'OBC': 'OBC',
            'SC': 'SC',
            'ST': 'ST',
            'EWS': 'EWS',
            'General Defence': 'GEN-DEF',
            'OBC Defence': 'OBC-DEF',
            'SC Defence': 'SC-DEF',
            'ST Defence': 'ST-DEF',
            'EWS Defence': 'EWS-DEF',
            "General PWD": "GEN-PWD",
            "OBC PWD": "OBC-PWD",
            "SC PWD": "SC-PWD",
            "ST PWD": "ST-PWD",
            "EWS PWD": "EWS-PWD",
            'General Girl Candidate': 'GEN-SGC',
            'OBC Girl Candidate': 'OBC-SGC',
            'SC Girl Candidate': 'SC-SGC',
            'ST Girl Candidate': 'ST-SGC',
            'EWS Girl Candidate': 'EWS-SGC',
            "General SGC": "GEN-SGC",
            "OBC SGC": "GEN-SGC",
            "SC SGC": "GEN-SGC",
            "ST SGC": "GEN-SGC",
            "EWS SGC": "GEN-SGC",
            'Kashmiri Migrant': 'KM'
        };

        if (!(category in categoryMap)) {
            console.error('Validation Error: Invalid category');
            throw new ApiError(400, 'Invalid category');
        }

        const categoryInAbreviation = categoryMap[category];

        const query_dtu_2024 = `
            SELECT branch, jee_rank , round
            FROM dtu_2024
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_dtu_2023 = `
            SELECT branch, jee_rank , round
            FROM dtu_2023
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_dtu_2022 = `
            SELECT branch, jee_rank , round
            FROM dtu_2022
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_2024 = `
            SELECT branch, jee_rank , round
            FROM nsut_2024
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_2023 = `
            SELECT branch, jee_rank , round
            FROM nsut_2023
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_2022 = `
            SELECT branch, jee_rank , round
            FROM nsut_2022
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_iiitd_2024 = `
            SELECT branch, jee_rank , round
            FROM iiitd_2024
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_iiitd_2023 = `
            SELECT branch, jee_rank , round
            FROM iiitd_2023
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_iiitd_2022 = `
            SELECT branch, jee_rank , round
            FROM iiitd_2022
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_igdtuw_2024 = `
            SELECT branch, jee_rank , round
            FROM igdtuw_2024
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_igdtuw_2023 = `
            SELECT branch, jee_rank , round
            FROM igdtuw_2023
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_igdtuw_2022 = `
            SELECT branch, jee_rank , round
            FROM igdtuw_2022
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_e_2024 = `
            SELECT branch, jee_rank , round
            FROM nsut_e_2022
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_e_2023 = `
            SELECT branch, jee_rank , round
            FROM nsut_e_2023
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_e_2022 = `
            SELECT branch, jee_rank , round
            FROM nsut_e_2022
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_w_2024 = `
            SELECT branch, jee_rank , round
            FROM nsut_w_2024
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_w_2023 = `
            SELECT branch, jee_rank , round
            FROM nsut_w_2023
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3
        `;

        const query_nsut_w_2022 = `
            SELECT branch, jee_rank , round
            FROM nsut_w_2022
            WHERE jee_rank >= $1
            AND region = $2
            AND category = $3   
        `;
      

        let result_dtu_2024 = await sql.query(query_dtu_2024, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_dtu_2023 = await sql.query(query_dtu_2023, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_dtu_2022 = await sql.query(query_dtu_2022, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_2024 = await sql.query(query_nsut_2024, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_2023 = await sql.query(query_nsut_2023, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_2022 = await sql.query(query_nsut_2022, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_iiitd_2024 = await sql.query(query_iiitd_2024, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_iiitd_2023 = await sql.query(query_iiitd_2023, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_iiitd_2022 = await sql.query(query_iiitd_2022, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_igdtuw_2024 = await sql.query(query_igdtuw_2024, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_igdtuw_2023 = await sql.query(query_igdtuw_2023, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_igdtuw_2022 = await sql.query(query_igdtuw_2022, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_e_2024 = await sql.query(query_nsut_e_2024, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_e_2023 = await sql.query(query_nsut_e_2023, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_e_2022 = await sql.query(query_nsut_e_2022, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_w_2024 = await sql.query(query_nsut_w_2024, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_w_2023 = await sql.query(query_nsut_w_2023, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        let result_nsut_w_2022 = await sql.query(query_nsut_w_2022, [
            Number(rank), 
            domicileInAbreviation, 
            categoryInAbreviation
        ]);

        result_dtu_2024 = result_dtu_2024.map((row) => ({
            ...row,
            year: 2024,
            college: 'DTU'
        }));

        result_dtu_2023 = result_dtu_2023.map((row) => ({
            ...row,
            year: 2023,
            college: 'DTU'
        }));

        result_dtu_2022 = result_dtu_2022.map((row) => ({
            ...row,
            year: 2022,
            college: 'DTU'
        }));

        result_nsut_2024 = result_nsut_2024.map((row) => ({
            ...row,
            year: 2024,
            college: 'NSUT'
        }));

        result_nsut_2023 = result_nsut_2023.map((row) => ({
            ...row,
            year: 2023,
            college: 'NSUT'
        }));

        result_nsut_2022 = result_nsut_2022.map((row) => ({
            ...row,
            year: 2022,
            college: 'NSUT'
        }));

        result_iiitd_2024 = result_iiitd_2024.map((row) => ({
            ...row,
            year: 2024,
            college: 'IIITD'
        }));

        result_iiitd_2023 = result_iiitd_2023.map((row) => ({
            ...row,
            year: 2023,
            college: 'IIITD'
        }));

        result_iiitd_2022 = result_iiitd_2022.map((row) => ({
            ...row,
            year: 2022,
            college: 'IIITD'
        }));

        result_igdtuw_2024 = result_igdtuw_2024.map((row) => ({
            ...row,
            year: 2024,
            college: 'IGDTUW'
        }));

        result_igdtuw_2023 = result_igdtuw_2023.map((row) => ({
            ...row,
            year: 2023,
            college: 'IGDTUW'
        }));

        result_igdtuw_2022 = result_igdtuw_2022.map((row) => ({
            ...row,
            year: 2022,
            college: 'IGDTUW'
        }));

        result_nsut_e_2024 = result_nsut_e_2024.map((row) => ({
            ...row,
            year: 2024,
            college: 'NSUT East Campus'
        }));    

        result_nsut_e_2023 = result_nsut_e_2023.map((row) => ({
            ...row,
            year: 2023,
            college: 'NSUT East Campus'
        }));

        result_nsut_e_2022 = result_nsut_e_2022.map((row) => ({
            ...row,
            year: 2022,
            college: 'NSUT East Campus'
        }));

        result_nsut_w_2024 = result_nsut_w_2024.map((row) => ({
            ...row,
            year: 2024,
            college: 'NSUT West Campus'
        }));

        result_nsut_w_2023 = result_nsut_w_2023.map((row) => ({
            ...row,
            year: 2023,
            college: 'NSUT West Campus'
        }));

        result_nsut_w_2022 = result_nsut_w_2022.map((row) => ({
            ...row,
            year: 2022,
            college: 'NSUT West Campus'
        }));

        const results = [
            ...result_dtu_2024,
            ...result_dtu_2023,
            ...result_dtu_2022,
            ...result_nsut_2024,
            ...result_nsut_2023,
            ...result_nsut_2022,
            ...result_iiitd_2024,
            ...result_iiitd_2023,
            ...result_iiitd_2022,
            ...result_igdtuw_2024,
            ...result_igdtuw_2023,
            ...result_igdtuw_2022,
            ...result_nsut_e_2024,
            ...result_nsut_e_2023,
            ...result_nsut_e_2022,
            ...result_nsut_w_2024,
            ...result_nsut_w_2023,
            ...result_nsut_w_2022
        ];

        const sortedResults = results.sort((a, b) => a.jee_rank - b.jee_rank);

        return res.status(200).json(
            new ApiResponse(200, sortedResults, 'Branches fetched successfully')
        );

    } catch (error) {
        console.error(error)
        throw new ApiError(500, 'Error fetching branches', error.message);
    }
});

export { getBranches }