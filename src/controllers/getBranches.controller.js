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

const getBranchesV2 =asyncHandler(async (req, res) => {
    try {
        const { counselling, rank, domicile, category, subcategory, year, college_type, adv_rank } = req.body;

        if(!counselling) {
            throw new ApiError(400, 'Counselling is required');
        }

        if(!year) {
            throw new ApiError(400, 'Year is required');
        }

        if(counselling == "JOSAA") {

            // validation for Josaa
            
            if(!college_type) {
                throw new ApiError(400, 'College type is required');
            }
            
            if(college_type === "IIT") {
                if(!adv_rank) {
                    throw new ApiError(400, 'Advanced rank is required');
                }

                if (!category) {
                    throw new ApiError(400, 'Category is required');
                }

                if (isNaN(Number(adv_rank)) || adv_rank < 0) {
                    throw new ApiError(400, 'Rank should be a number');
                }

                if (!subcategory) {
                    throw new ApiError(400, 'Subcategory is required');
                }

                if(!year) {
                    throw new ApiError(400, 'Year is required');
                }

                const query = `            
                SELECT branch, opening, closing, round, college
                FROM all_iit_${year}
                WHERE opening >= $1
                    category = $2`

                const result = await sql.query(query, [
                    Number(rank),
                    category,
                ]);

                return res.status(200).json(
                    new ApiResponse(200, result, 'Branches fetched successfully')
                );

            }else if(college_type === "NIT") {
                if (!rank) {
                    throw new ApiError(400, 'Rank is required');
                }

                if (!domicile) {
                    throw new ApiError(400, 'Domicile is required');
                }

                if (!category) {
                    throw new ApiError(400, 'Category is required');
                }

                if (!subcategory) {
                    throw new ApiError(400, 'Subcategory is required');
                }

                if (isNaN(Number(rank)) || rank < 0) {
                    throw new ApiError(400, 'Rank should be a number');
                }

                if (!year) {
                    throw new ApiError(400, 'Year is required')
                }

                const coure_mapping = {
                    "Yj1m0": "Computer Science and Engineering",
                    "E8gk7": "Mechanical Engineering",
                    "1q6jm": "Electrical Engineering",
                    "1po3E": "Civil Engineering",
                    "4o8iJ": "Electronics and Communication Engineering",
                    "r13KX": "Mechatronics Engineering",
                    "jot61": "Engineering Physics",
                    "2iD2K": "Chemical Engineering",
                    "z0p7W": "Mathematics 4-Year B.S. Course",
                    "tX84d": "Economics 4-Year B.S. Course",
                    "60Kdh": "Electrical Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "0wrA1": "Environmental Science and Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "6jm7j": "Mechanical Engineering and M.Tech in Computer Integrated Manufacturing 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "8KsI1": "Aerospace Engineering",
                    "9A6ZB": "Metallurgical Engineering and Materials Science",
                    "A11vZ": "Metallurgical and Materials Engineering",
                    "1SG5j": "Engineering Physics 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "5Gx8M": "Civil Engineering and M.Tech in Environmental Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "1oQR6": "Civil Engineering and M.Tech in Structural Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "55wwS": "Computer Science and Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "zYD32": "Electrical Engineering and M.Tech in Power Electronics and Drives 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "z9le0": "Electrical Engineering and M.Tech in VLSI Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "1D8Vu": "Mechanical Engineering and M.Tech in Mechanical System Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "M25fq": "Metallurgical and Materials Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "9Y7kC": "Mechanical Engineering with M.Tech in Manufacturing Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "8GxL4": "Civil Engineering and M.Tech in Transportation Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "OoB68": "Mechanical Engineering and M.Tech in Thermal Science & Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "HvS04": "Energy Engineering",
                    "t73pk": "Chemistry 4-Year B.S. Course",
                    "e4A5e": "Chemical Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "As89o": "Mathematics and Computing",
                    "1moH2": "Materials Engineering",
                    "EjS97": "Engineering and Computational Mechanics",
                    "1t1bM": "Textile Technology",
                    "1hcm8": "Production and Industrial Engineering",
                    "89Vbi": "Biotechnology and Biochemical Engineering",
                    "e8D4y": "Electrical Engineering with specialization in Power and Automation",
                    "pU88J": "Mathematics and Computing 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "7pLJ8": "Agricultural and Food Engineering",
                    "1xs3z": "Electronics and Electrical Communication Engineering",
                    "x2E7t": "Instrumentation Engineering",
                    "e2u4x": "Industrial and Systems Engineering",
                    "d8Po6": "Manufacturing Science and Engineering",
                    "24yXP": "Mining Engineering",
                    "0cI2y": "Ocean Engineering and Naval Architecture",
                    "8lNy9": "Physics 4-Year B.S. Course",
                    "56fXh": "Applied Geology 4-Year B.S. Course",
                    "hA9F6": "Applied Geology",
                    "36cPA": "Mathematics and Computing 4-Year B.S. Course",
                    "6Ueo6": "Exploration Geophysics 4-Year B.S. Course",
                    "hGT91": "Architecture 5-Year B.Arch. Course",
                    "W8cx0": "Aerospace Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "k34hi": "Agricultural and Food Engineering with M.Tech in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "GQ47b": "Biotechnology and Biochemical Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "2d0PG": "Civil Engineering with any of the listed specialization 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "i3wE5": "Electrical Engineering with M.Tech in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "Jz04U": "Electronics and Electrical Communication Engineering with M.Tech in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "ts99W": "Industrial and Systems Engineering with M.Tech in Industrial and Systems Engineering and Management 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "1fN4y": "Manufacturing Science and Engineering with M.Tech in Industrial and Systems Engineering and Management 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "VBD90": "Mechanical Engineering with M.Tech in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "K7a8F": "Mining Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "5RZ7t": "Mining Safety Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "7w7ry": "Ocean Engineering and Naval Architecture 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "i70Ax": "Artificial Intelligence and Data Science",
                    "QR8Z7": "Artificial Intelligence",
                    "9KFp3": "Biomedical Engineering",
                    "V1B3u": "Biotechnology and Bioinformatics",
                    "95pOb": "Computational Engineering",
                    "9sjc6": "Electrical Engineering with specialization in IC Design and Technology",
                    "76EOO": "Engineering Science",
                    "2xj8c": "Industrial Chemistry",
                    "0Bl4p": "Materials Science and Metallurgical Engineering",
                    "Zo66F": "Bio Engineering",
                    "I72hY": "Chemistry with specialization 4-Year B.S. Course",
                    "c1G7Z": "Physics with specialization 4-Year B.S. Course",
                    "1btS2": "Civil and Infrastructure Engineering",
                    "M4U2Y": "Biological Sciences and Bioengineering",
                    "5z3Ra": "Materials Science and Engineering",
                    "eqc26": "Earth Sciences 4-Year B.S. Course",
                    "n1E8i": "Mathematics and Scientific Computing 4-Year B.S. Course",
                    "h1H3n": "Statistics and Data Science 4-Year B.S. Course",
                    "28tjZ": "Naval Architecture and Ocean Engineering",
                    "e1H4J": "Biological Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "6eF0A": "Engineering Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "WNY93": "Biological Sciences 5-Year B.S. + M.S. (Dual Degree) Course",
                    "13dNg": "Physics 5-Year B.S. + M.S. (Dual Degree) Course",
                    "x7W3s": "Electrical and Electronics Engineering",
                    "l9gb3": "Biosciences and Bioengineering",
                    "VWb94": "Data Science and Artificial Intelligence",
                    "8O9LU": "Mathematics and Computing 5-Year B.S. + M.S. (Dual Degree) Course",
                    "y6pz9": "Geological Technology 5-Year Integrated M.Tech. Course",
                    "Fy3g2": "Geophysical Technology 5-Year Integrated M.Tech. Course",
                    "aw61O": "Chemical Sciences 5-Year B.S. + M.S. (Dual Degree) Course",
                    "Jy3w9": "Economics 5-Year B.S. + M.S. (Dual Degree) Course",
                    "98ffZ": "Environmental Engineering",
                    "O9s4Y": "Mineral and Metallurgical Engineering",
                    "vF8V0": "Mining Machinery Engineering",
                    "oAM86": "Petroleum Engineering",
                    "5RB5N": "Applied Geology 5-Year Integrated M.Tech. Course",
                    "Sr1j4": "Applied Geophysics 5-Year Integrated M.Tech. Course",
                    "SCk64": "Mathematics and Computing 5-Year Integrated M.Tech. Course",
                    "bV8D5": "Ceramic Engineering",
                    "ZFn02": "Biochemical Engineering with M.Tech in Biochemical Engineering and Biotechnology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "GK2a8": "Bioengineering with M.Tech in Biomedical Technology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "ln89w": "Ceramic Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "rl6J2": "Civil Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "u5u3c": "Electrical Engineering with M.Tech in Power Electronics 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "i6v6Q": "Industrial Chemistry 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "aVx19": "Materials Science and Technology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "3d2zA": "Mechanical Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "2cMX9": "Metallurgical Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "op08N": "Pharmaceutical Engineering and Technology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "VK4K0": "Electronics Engineering",
                    "p02Ko": "Metallurgical Engineering",
                    "7HF9G": "Pharmaceutical Engineering and Technology",
                    "Kt96p": "Chemical Science and Technology",
                    "DYs04": "Electronics and Electrical Engineering",
                    "X74Ff": "Data Science and Engineering",
                    "8v6yZ": "Chemical and Biochemical Engineering",
                    "DP83l": "Interdisciplinary Sciences 5-Year B.S. + M.S. (Dual Degree) Course",
                    "D5Ns5": "Civil Engineering and M. Tech. in Structural Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "TR18K": "Civil Engineering and M.Tech. in Environmental Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "hX64b": "Electrical Engineering and M.Tech Power Electronics and Drives 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "2HrT9": "Mechanical Engineering and M. Tech. in Mechanical System Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "Y2IA7": "Mechanical Engineering and M. Tech. in Thermal Science & Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "JS22v": "Mechanical Engineering with M.Tech. in Manufacturing Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "0u5kV": "Environmental Science and Engineering",
                    "r2Ql9": "BS in Mathematics 4-Year B.S. Course",
                    "91WXc": "B.Tech in General Engineering",
                    "16UZD": "B.Tech in Engineering Science",
                    "kt4H3": "B.Tech in Materials Science and Engineering",
                    "7y0pL": "B.Tech in Mathematics and Computing",
                    "u5rA0": "B.Tech in Microelectronics & VLSI",
                    "tA0i6": "BS in Chemical Sciences 4-Year B.S. Course",
                    "0B1pr": "Electrical Engineering (Power and Automation)",
                    "oJ92x": "Space Sciences and Engineering",
                    "Fc4J1": "Agricultural and Food Engineering with M.Tech. in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "8PyX3": "Electrical Engineering with M.Tech. in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "7HU2k": "Electronics and Electrical Communication Engineering with M.Tech. in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "rG40r": "Industrial and Systems Engineering with M.Tech. in Industrial and Systems Engineering and Management 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "1J4Pq": "Manufacturing Science and Engineering with M.Tech. in Industrial and Systems Engineering and Management 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "e7Hd2": "Mechanical Engineering with M.Tech. in any of the listed specializations 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "g7k0w": "Electrical Engineering (IC Design and Technology)",
                    "61kwX": "Chemistry with Specialization 4-Year B.S. Course",
                    "01dKL": "Physics with Specialization 4-Year B.S. Course",
                    "53WKL": "Biological Science 4-Year B.S. Course",
                    "0Dm5s": "Biological Engineering",
                    "84EGY": "B.Tech. in Electronics and Communication Engineering and M.Tech. in Communication Systems 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "35TMJ": "B. Tech. (ME) -MBA (NITIE) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "9MVJ2": "B. Tech in CE. -M. Tech. in Geotechnical Engineering 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "kHx98": "B. Tech in CE. -M. Tech. in Structural Engineering 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "1UT7l": "B. Tech. (CSE) and M.Tech in CSE 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "2f2Ue": "B. Tech. (ECE) -M. Tech. in VLSI 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "f0w1e": "B. Tech. (EEE)-M. Tech. in (Power &. Control) 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "9u3jT": "B. Tech. (Mathematics & Computing) M. Tech. in (Mathematics & Computing) 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "wq32M": "B. Tech. (ME) -M. Tech. in Mechatronics 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "Q14YW": "Mathematics & Computing 5-Year B.S. + M.S. (Dual Degree) Course",
                    "9D0Ab": "Artificial Intelligence and Data Engineering",
                    "IW7d3": "Pharmaceutical Engineering & Technology",
                    "Wd2s6": "Biochemical Engineering with M.Tech. in Biochemical Engineering and Biotechnology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "8cl1m": "Electrical Engineering with M.Tech. in Power Electronics 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "3YM2s": "Pharmaceutical Engineering & Technology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "Vz64Q": "Industrial Engineering and Operations Research",
                    "YX3y4": "General Engineering",
                    "Qy3P2": "Microelectronics and VLSI",
                    "m1E4a": "Chemical Sciences 4-Year B.S. Course",
                    "0BOc2": "Artificial Intelligence and Data Analytics",
                    "Qr0r2": "Integrated Circuit Design and Technology",
                    "5tq6S": "Electronics and Communication Engineering and M.Tech. in Communication Systems 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "41VLi": "Artificial Intelligence and Data Science and MBA in Digital Business Management (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "2m9AF": "Chemical Engineering and MBA in Hospital and Health Care Management (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "Gv9V4": "Chemical Science and Technology and MBA in Hospital and Health Care Management (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "lSD21": "Civil Engineering and MBA (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "2teM3": "Bio Technology",
                    "uw1E6": "Electronics and VLSI Engineering",
                    "W3g4o": "Industrial and Production Engineering",
                    "pX89z": "Information Technology",
                    "3H5Ay": "Instrumentation and Control Engineering",
                    "c60xL": "Planning 4-Year B.Plan. Course",
                    "QJ8N1": "Mathematics and Data Science 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "h18cI": "Electronics and Instrumentation Engineering",
                    "Dp34W": "Production Engineering",
                    "A4U3G": "Computational Mathematics 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "P71oK": "Chemistry 5-Year B.S. + M.S. (Dual Degree) Course",
                    "4xm0E": "VLSI Design and Technology",
                    "Xok73": "Biotechnology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "k43sH": "Chemistry 5-Year Integrated M.Sc. Course",
                    "d3P8P": "Electronics and Communication Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "lAr66": "Computational and Data Science",
                    "Wq9F5": "Material Science and Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "9rPo6": "Mathematics and Computing Technology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "yG1E3": "Mechanical Engineering with specialization in Manufacturing and Industrial Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "t0x2d": "Chemical Technology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "B0Jq8": "Civil Engineering with specialization in Construction Technology and Management 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "B3I3z": "Computer Science and Engineering with specialization in Cyber Security 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "qR84n": "Computer Science and Engineering with specialization in Data Science 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "wK96Y": "Electrical Engineering with specialization In Power System Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "Y97Ox": "Electronics and Communication Engineering with specialization in Microelectronics and VLSI System Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "9x7mW": "Mechatronics and Automation Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "39Vwc": "Mechatronics and Automation Engineering",
                    "cNP68": "Bio Medical Engineering",
                    "k4Q6R": "Artificial Intelligence and Machine Learning",
                    "yYW68": "Robotics and Automation",
                    "Q7N5l": "Sustainable Energy Technologies",
                    "ny6F3": "Industrial Internet of Things",
                    "LY0f6": "Microelectronics and VLSI Engineering",
                    "X3R4P": "Architecture and Planning 5-Year B.Arch. Course",
                    "H29fA": "Ceramic Engineering and M.Tech. in Industrial Ceramic 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "miQ97": "Life Science 5-Year Integrated M.Sc. Course",
                    "3n8jz": "Mathematics 5-Year Integrated M.Sc. Course",
                    "EW50V": "Physics 5-Year Integrated M.Sc. Course",
                    "6K7ok": "Food Process Engineering",
                    "Gyc93": "Industrial Design",
                    "7etp7": "Computer Science and Engineering with specialization in Artificial Intelligence and Data Science",
                    "T57xy": "Electronics and Communication Engineering with specialization in VLSI Design and Technology",
                    "s6b2s": "Artificial Intelligence 5-Year Integrated B.Tech and M.Tech. Course",
                    "9eE9F": "Computer Science and Engineering with specialization in Data Science and Analytics",
                    "CG2c0": "Computer Science and Engineering with specialization in Cyber Security",
                    "7Vjm2": "Computer Science and Engineering with specialization in Data Science",
                    "7LOC7": "Information Technology-Business Informatics",
                    "J5u1h": "Computer Science and Engineering with specialization in Artificial Intelligence",
                    "r87aq": "Smart Manufacturing",
                    "c46uo": "Electronics and Communication Engineering and M.Tech. in VLSI Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "ARK62": "Mechanical Engineering and M.Tech. in AI and Robotics 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "79ANl": "Electronics and Communication Engineering with specialization in VLSI and Embedded Systems",
                    "Y2aX3": "Electronics and Communication Engineering with specialization in Design and Manufacturing",
                    "7W5Yv": "Mechanical Engineering with specialization in Design and Manufacturing",
                    "Hp83k": "Computer Science and Engineering with specialization in Data Science and Artificial Intelligence 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "Xq15d": "Electronics and Communication Engineering with specialization in Embedded Systems and Internet of Things 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "D0H3Y": "Computer Science and Engineering with specialization in Artificial lntelligence and Machine Learning",
                    "0e1GU": "Electronics and Communication Engineering with specialization in Internet of Things",
                    "3Sc7k": "Computer Science and Engineering with specialization in Human Computer lnteraction and Gaming Technology",
                    "19Zol": "Computer Science",
                    "JaU15": "Computer Science and Business",
                    "j05Or": "Computer Science and Artificial Intelligence",
                    "RX6x9": "Computer Engineering",
                    "Z71iv": "Electronics and Communication Engineering (Under Flexible Academic Program)",
                    "v7ws2": "Information Technology (Under Flexible Academic Program)",
                    "h50cp": "Computer Science and Engineering with major in Artificial Intelligence",
                    "X24oQ": "Computer Science and Engineering with specialization of Data Science and Artificial Intelligence 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "15apr": "Electronics and Communication Engineering with specialization of Embedded Systems and Internet of Things 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "Q4t7K": "Computer Science Engineering with specialization in Data Science and Analytics",
                    "Y9c6Y": "Computer Science Engineering with specialization in Human Computer lnteraction and Gaming Technology",
                    "B74NN": "Computer Science and Engineering with Major in Artificial Intelligence",
                    "B5BV1": "B.Tech. in Electronics and Communication Engineering and M.Tech. in VLSI Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "h7fp1": "Electronics and Communication Engineering (with Specialization of Embedded Systems and Internet of Things) 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "2H9Xh": "Computer Science and Engineering (with Specialization of Data Science and Artificial Intelligence) 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "mmP36": "Computer Science Engineering (Artificial lntelligence and Machine Learning)",
                    "k36By": "Computer Science Engineering (Data Science and Analytics)",
                    "F13dw": "Computer Science Engineering (Human Computer lnteraction and Gaming Technology)",
                    "xd7k4": "Electronics and Communication Engineering (Internet of Things)",
                    "X0FP8": "5-Year B.Arch. Course Architecture",
                    "f00oW": "5-Year Integrated M.Sc. Course Food Technology",
                    "6qC2v": "5-Year Integrated M.Sc. Course Mathematics and Computing",
                    "z04pL": "5-Year Integrated M.Sc. Course Physics",
                    "5u7dd": "5-Year Integrated M.Sc. Course Quantitative Economics and Data Science",
                    "k9LB8": "4-Year B.Tech./ B.Tech. (Hons.) Course Computer Science and Engineering with specialization in Data Science",
                    "IY9Y4": "Electronics and Telecommunication Engineering",
                    "95asm": "Metallurgy and Materials Engineering",
                    "OCI54": "Agricultural Engineering",
                    "dp3P8": "Food Engineering and Technology",
                    "u7Zo3": "Food Technology",
                    "7H3tQ": "Electronics & Communication Engineering",
                    "5iU9v": "5-Year Integrated M.Sc. Course Quantitative Economics & Data Science",
                    "8lE2Z": "4-Year B.Tech./ B.Tech. (Hons.) Course Computer Science Engineering (Artificial Intelligence)",
                    "M4S6q": "Electronics Engineering (VLSI Design and Technology)",
                    "1uh8t": "4-Year B.Tech./ B.Tech. (Hons.) Course Computer Science Engineering (Data Science)",
                    "Z7O7B": "Mathematics and Computing 5-Year Integrated M.Sc. Course",
                    "QI65K": "Quantitative Economics and Data Science 5-Year Integrated M.Sc. Course",
                    "2jI6l": "Electronics Engineering with specialization in VLSI Design and Technology",
                    "60wST": "Computer Science and Engineering with specialization in Artificial Intelligence 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "4fLU1": "Computer Science and Engineering with specialization in Data Science 4-Year B.Tech./ B.Tech. (Hons.) Course",
                    "r4u1S": "Materials Engineering 5-Year Integrated M.Tech. Course",
                    "92ppC": "Bachelor of Design 4-Year B.Des. Course",
                    "z2U0j2": "Artificial Intelligenece and Data Science with specialization in Transportation and Logistics",
                    "qw2k5": "Aviation Engineering",
                    "WIn31": "Civil Engineering with specialization in Rail Engineering",
                    "C7wz8": "Electrical Engineering with specialization in Rail Engineering",
                    "z2U0j": "Electronics and Communication Engineering with spepecialization in Transportation and Logistics",
                    "1Cc3x": "Electronics and Communication Engineering with specialization in Rail Engineering",
                    "74ASt": "Mechanical Engineering with specialization in Rail Engineering",
                    "ABCDEF": "Bio Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "GHIJKL": "Electrical and Electronics Engineering and MBA (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "MNOPQR": "Electronics and Communication Engineering and MBA in Hospital and Healthcare Management (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "STUVWX": "Engineering Physics and MBA (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "YZ1234": "Mechanical Engineering and MBA (IIM Mumbai) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "567890": "Civil Engineering and M.Tech. in Geotechnical Engineering 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "123456": "Civil Engineering and M.Tech. in Structural Engineering 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "abcGfd": "Computer Science and Engineering 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "ghijkL": "Electrical and Electronics Engineering and M.Tech. in Power and Control 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "mnopQR": "Electronics and Communication Engineering and M.Tech. in VLSI 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "abcd34": "Mathematics and Computing 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "efgh56": "Mechanical Engineering and M.Tech. in Mechatronics 5-Year B.Tech + M.Tech./MS (Dual Degree) Course",
                    "ijkl78": "Economics and MBA (IIM Bodh Gaya) 5-Year B.S. + MBA (Dual Degree) Course",
                    "mnop90": "Computer Science and Engineering and MBA in Digital Business Management (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "qrst12": "Mathematics and Computing and MBA in Digital Business Management (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "uvwx34": "Metallurgical and Materials Engineering and MBA (IIM Bodh Gaya) 5-Year B.Tech + MBA (Dual Degree) Course",
                    "yzABCD": "Biochemical Engineering and M.Tech. in Biochemical Engineering and Biotechnology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "EFGHIJ": "Bioengineering and M.Tech. in Biomedical Technology 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "KLMNOP": "Electrical Engineering and M.Tech. in Power Electronics 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "QRSTUV": "Ceramic Engineering and M.Tech in Industrial Ceramic 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "WXYZ12": "Civil Engineering with Specialization in Construction Technology and Management 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "345678": "Computer Science and Engineering with Specialization in Cyber Security 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "90ABCD": "Computer Science and Engineering with Specialization in Data Science 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "EFGkIJ": "Electrical Engineering with Specialization In Power System Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "KoMNOP": "Electronics and Communication Engineering with Specialization in Microelectronics and VLSI System Design 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "QxSTUV": "Mechanical Engineering with Specialization in Manufacturing and Industrial Engineering 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "WXyZ12": "Ceramic Engineering and M.Tech Industrial Ceramic 5-Year B.Tech + M.Tech. (Dual Degree) Course",
                    "34s678": "Electronics and Communication Engineering (VLSI Design and Technology)"
                }

                const domicileList = [domicile,"OS"]

                const query = `            
                SELECT branch, opening, closing, round, college
                FROM all_nit_${year}
                WHERE opening >= $1
                    category = $2
                    , quota = ANY($3)
                    and sub_category = $4`

                let result = await sql.query(query, [
                    Number(rank),
                    category,
                    domicileList,
                    subcategory
                ]);

                result = result.rows.map(row => ({
                    ...row,
                    branch: coure_mapping[row.branch] || row.branch,
                }))

                const branchMap = {};

                result.forEach(item => {
                    const key = `${item.college}_${item.branch}_${item.year}_${item.round}`;
                    branchMap[key] = item;
                });

                const uniqueResults = Object.values(branchMap);

                const sortedResults = uniqueResults.sort((a, b) => a.jee_rank - b.jee_rank);

                return res.status(200).json(
                    new ApiResponse(200, sortedResults, 'Branches fetched successfully')
                );

            }else if(college_type === "IIIT") {
                if (!rank) {
                    throw new ApiError(400, 'Rank is required');
                }

                if (!category) {
                    throw new ApiError(400, 'Category is required');
                }

                if (!subcategory) {
                    throw new ApiError(400, 'Subcategory is required');
                }

                if (isNaN(Number(rank)) || rank < 0) {
                    throw new ApiError(400, 'Rank should be a number');
                }

                                if (!year) {
                    throw new ApiError(400, 'Year is required')
                }

                const query = `            
                SELECT branch, opening, closing, round, college
                FROM all_iiit_${year}
                WHERE opening >= $1
                    category = $3
                    and domicile = $2`

                const result = await sql.query(query, [
                    Number(rank),
                    domicile,
                    category,
                ]);

                return res.status(200).json(
                    new ApiResponse(200, result, 'Branches fetched successfully')
                );

            }else if(college_type === "GFTI") {
                if (!rank) {
                    throw new ApiError(400, 'Rank is required');
                }

                if (!domicile) {
                    throw new ApiError(400, 'Domicile is required');
                }

                if (!category) {
                    throw new ApiError(400, 'Category is required');
                }

                if (!subcategory) {
                    throw new ApiError(400, 'Subcategory is required');
                }

                if (isNaN(Number(rank)) || rank < 0) {
                    throw new ApiError(400, 'Rank should be a number');
                }

                const query = `            
                SELECT branch, opening, closing, round, college
                FROM all_gfti_${year}
                WHERE opening >= $1
                    category = $3
                    and domicile = $2`

                const result = await sql.query(query, [
                    Number(rank),
                    domicile,
                    category,
                ]);

                return res.status(200).json(
                    new ApiResponse(200, result, 'Branches fetched successfully')
                );

            }else {
                throw new ApiError(400, 'Invalid college type');
            }
            // validation for Josaa end
        }else if(counselling == "JAC") {
            // validation for JAC
            if (!rank) {
                throw new ApiError(400, 'Rank is required');
            }

            if (!domicile) {
                throw new ApiError(400, 'Domicile is required');
            }

            if (!category) {
                throw new ApiError(400, 'Category is required');
            }

            if (isNaN(Number(rank)) || rank < 0) {
                throw new ApiError(400, 'Rank should be a number');
            }

        }
    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Error fetching branches', error.message);
        
    }
});

export { getBranches };