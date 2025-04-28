import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import sql from '../db/db01.js';

const getBranches = asyncHandler(async (req, res) => {
    try {
        const { rank, domicile, category } = req.body;

        if (!rank) {
            throw new ApiError(400, 'Rank is required');
        }

        if (!domicile) {
            throw new ApiError(400, 'Domicile is required');
        }

        if (!category) {
            throw new ApiError(400, 'Category is required');
        }

        if (isNaN(Number(rank))) {
            throw new ApiError(400, 'Rank should be a number');
        }

        if (rank < 0) {
            throw new ApiError(400, 'Rank should be a positive number');
        }

        if (domicile !== 'Delhi' && domicile !== 'Outside Delhi') {
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
            'General Girl Candidate': 'GEN-GC',
            'OBC Girl Candidate': 'OBC-GC',
            'SC Girl Candidate': 'SC-GC',
            'ST Girl Candidate': 'ST-GC',
            'EWS Girl Candidate': 'EWS-GC',
            "General SGC": "GEN-SGC",
            "OBC SGC": "OBC-SGC",
            "SC SGC": "SC-SGC",
            "ST SGC": "ST-SGC",
            "EWS SGC": "EWS-SGC",
        };

        if (!(category in categoryMap)) {
            console.error('Validation Error: Invalid category');
            throw new ApiError(400, 'Invalid category');
        }

        const categoryInAbbreviation = categoryMap[category]; // user chosen category in abbreviation

        // Check if the category is an SGC category
        const isSGC = categoryInAbbreviation.endsWith('-SGC');
        // Check if the category is an SG category
        const isGC = categoryInAbbreviation.endsWith('-GC');

        // Get the base category (without -SGC or -SG suffix)
        const baseCategory = isSGC ? categoryInAbbreviation.replace('-SGC', '') :
            isGC ? categoryInAbbreviation.replace('-GC', '') :
                categoryInAbbreviation;

        const psydoCategory = isGC ? categoryInAbbreviation.replace('-GC', '-SGC') :
            categoryInAbbreviation;

        // Set categories for DTU/IGDTUW
        let dtuIgdtuwCategories = [];
        if (isSGC) {
            // If SGC category: add both SGC and base category
            dtuIgdtuwCategories = ['SGC', baseCategory];
        } else if (isGC) {
            // If SG category: use just the base category
            dtuIgdtuwCategories = [baseCategory];
        } else {
            // For all other categories, use as is
            dtuIgdtuwCategories = [categoryInAbbreviation];
        }

        // Set categories for NSUT
        let nsutCategories = [];
        if (isSGC) {
            // If SGC category: use just SGC
            nsutCategories = [psydoCategory, baseCategory];
        } else if (isGC) {
            // If SG category: use base category + SGC
            nsutCategories = [baseCategory, psydoCategory];
        } else {
            // For all other categories, use as is
            nsutCategories = [categoryInAbbreviation];
        }

        // Set categories for IIITD
        let iiitdCategories = [];
        if (isSGC || isGC) {
            // For both SGC and SG categories: use just the base category
            iiitdCategories = [baseCategory];
        } else {
            // For all other categories, use as is
            iiitdCategories = [categoryInAbbreviation];
        }

        console.log({
            categoryInAbbreviation,
            dtuIgdtuwCategories,
            nsutCategories,
            iiitdCategories
        });

        const query_dtu_2024 = `
            SELECT branch, jee_rank, round
            FROM dtu_2024
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_dtu_2023 = `
            SELECT branch, jee_rank, round
            FROM dtu_2023
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_dtu_2022 = `
            SELECT branch, jee_rank, round
            FROM dtu_2022
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_2024 = `
            SELECT branch, jee_rank, round
            FROM nsut_2024
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_2023 = `
            SELECT branch, jee_rank, round
            FROM nsut_2023
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_2022 = `
            SELECT branch, jee_rank, round
            FROM nsut_2022
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_iiitd_2024 = `
            SELECT branch, jee_rank, round, is_bonus
            FROM iiitd_2024
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_iiitd_2023 = `
            SELECT branch, jee_rank, round, is_bonus
            FROM iiitd_2023
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_iiitd_2022 = `
            SELECT branch, jee_rank, round, is_bonus
            FROM iiitd_2022
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_igdtuw_2024 = `
            SELECT branch, jee_rank, round
            FROM igdtuw_2024
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_igdtuw_2023 = `
            SELECT branch, jee_rank, round
            FROM igdtuw_2023
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_igdtuw_2022 = `
            SELECT branch, jee_rank, round
            FROM igdtuw_2022
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_e_2024 = `
            SELECT branch, jee_rank, round
            FROM nsut_e_2024
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_e_2023 = `
            SELECT branch, jee_rank, round
            FROM nsut_e_2023
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_e_2022 = `
            SELECT branch, jee_rank, round
            FROM nsut_e_2022
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_w_2024 = `
            SELECT branch, jee_rank, round
            FROM nsut_w_2024
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_w_2023 = `
            SELECT branch, jee_rank, round
            FROM nsut_w_2023
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)
        `;

        const query_nsut_w_2022 = `
            SELECT branch, jee_rank, round
            FROM nsut_w_2022
            WHERE jee_rank >= $1
              AND region = $2
              AND category = ANY($3)   
        `;

        let result_dtu_2024 = await sql.query(query_dtu_2024, [
            Number(rank),
            domicileInAbreviation,
            dtuIgdtuwCategories
        ]);

        let result_dtu_2023 = await sql.query(query_dtu_2023, [
            Number(rank),
            domicileInAbreviation,
            dtuIgdtuwCategories
        ]);

        let result_dtu_2022 = await sql.query(query_dtu_2022, [
            Number(rank),
            domicileInAbreviation,
            dtuIgdtuwCategories
        ]);

        let result_nsut_2024 = await sql.query(query_nsut_2024, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_nsut_2023 = await sql.query(query_nsut_2023, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_nsut_2022 = await sql.query(query_nsut_2022, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_iiitd_2024 = await sql.query(query_iiitd_2024, [
            Number(rank),
            domicileInAbreviation,
            iiitdCategories
        ]);

        let result_iiitd_2023 = await sql.query(query_iiitd_2023, [
            Number(rank),
            domicileInAbreviation,
            iiitdCategories
        ]);

        let result_iiitd_2022 = await sql.query(query_iiitd_2022, [
            Number(rank),
            domicileInAbreviation,
            iiitdCategories
        ]);

        let result_igdtuw_2024 = await sql.query(query_igdtuw_2024, [
            Number(rank),
            domicileInAbreviation,
            dtuIgdtuwCategories
        ]);

        let result_igdtuw_2023 = await sql.query(query_igdtuw_2023, [
            Number(rank),
            domicileInAbreviation,
            dtuIgdtuwCategories
        ]);

        let result_igdtuw_2022 = await sql.query(query_igdtuw_2022, [
            Number(rank),
            domicileInAbreviation,
            dtuIgdtuwCategories
        ]);

        let result_nsut_e_2024 = await sql.query(query_nsut_e_2024, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_nsut_e_2023 = await sql.query(query_nsut_e_2023, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_nsut_e_2022 = await sql.query(query_nsut_e_2022, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_nsut_w_2024 = await sql.query(query_nsut_w_2024, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_nsut_w_2023 = await sql.query(query_nsut_w_2023, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
        ]);

        let result_nsut_w_2022 = await sql.query(query_nsut_w_2022, [
            Number(rank),
            domicileInAbreviation,
            nsutCategories
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

// After combining all results but before sending the response
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

// Create an object to store the entries, overwriting as we go
const branchMap = {};

// Process all results, always keeping the latest entry for each unique combination
results.forEach(item => {
    const key = `${item.college}_${item.branch}_${item.year}_${item.round}`;
    // Always overwrite with the current item
    branchMap[key] = item;
});

// Convert the object back to an array
const uniqueResults = Object.values(branchMap);

// Sort by rank for the final output (lowest numerical rank first)
const sortedResults = uniqueResults.sort((a, b) => a.jee_rank - b.jee_rank);

return res.status(200).json(
    new ApiResponse(200, sortedResults, 'Branches fetched successfully')
);

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Error fetching branches', error.message);
    }
});

export { getBranches };