import express from "express"
import cors from "cors"
import rateLimit from "express-rate-limit"
import swaggerDocs from "./swagger.js"

const app = express()

const limiter = rateLimit({
    windowMs: 1000,
    max: 40,
    message: {
        error: "Too many requests from this IP, please try again later.",
        limit: 60,
        windowMs: 60000
    },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter)

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))

// Routes import
import healthcheckRouter from "./routes/healthcheck.routes.js"
import getBranchesRouter from "./routes/getBranches.routes.js"
import getPlacementRouter from "./routes/getPlacement.routes.js"
import getPlacementByBranchRouter from "./routes/getPlacementByBranch.routes.js"
import getRankRouter from "./routes/getRank.routes.js"
import postRankRouter from "./routes/postRank.routes.js"
import getCollegeBranchesRouter from "./routes/getCollegeBranches.routes.js"
import getSeatMatrixRouter from "./routes/getSeatMatrix.routes.js"
import getCollegeDataRouter from "./routes/getCollegeData.routes.js"
import cutoffRouter from "./routes/cutoff.routes.js"
import aboutRouter from "./routes/about.routes.js"
import placementRouter from "./routes/placement.routes.js"

// Initialize Swagger documentation
swaggerDocs(app);

// Routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/getBranches", getBranchesRouter)
app.use("/api/v1/getPlacement", getPlacementRouter)
app.use("/api/v1/getPlacementByBranch", getPlacementByBranchRouter)
app.use("/api/v1/getRank", getRankRouter)
app.use("/api/v1/postRank", postRankRouter)
app.use("/api/v1/getCollegeBranches", getCollegeBranchesRouter)
app.use("/api/v1/getSeatMatrix", getSeatMatrixRouter)
app.use("/api/v1/getCollegeData", getCollegeDataRouter)
app.use("/api/v2/cutoff", cutoffRouter)
app.use("/api/v2/about", aboutRouter)
app.use("/api/v2/placement", placementRouter)

export {app}