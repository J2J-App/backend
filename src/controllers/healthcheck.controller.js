import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    try {
        res.status(200).json(new ApiResponse(200, "OK", "Healthcheck is working fine! checking 1 2 3"))
    } catch (error) {
        throw new ApiError(500, "Internal Server Error", error.message)
    }
})

export {
    healthcheck
}
    