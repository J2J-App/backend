import express from "express"
import cors from "cors"

const app = express()

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

// Routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/getBranches", getBranchesRouter)
app.use("/api/v1/getPlacement", getPlacementRouter)
app.use("/api/v1/getPlacementByBranch", getPlacementByBranchRouter)
app.use("/api/v1/getRank", getRankRouter)
app.use("/api/v1/postRank", postRankRouter)

export {app}