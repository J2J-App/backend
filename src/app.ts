import express, {Express} from "express"
import http from "http"
import cors from "cors"

const app: Express = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))
app.set('trust proxy', true) 

import healthcheckRouter from "./routes/healthcheck.routes"
import clientRouter from "./routes/client.routes"
import freelancerRouter from "./routes/freelancer.routes"
import jobRouter from "./routes/job.routes"
import milestoneRouter from "./routes/milestone.routes"

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/clients", clientRouter)
app.use("/api/v1/freelancers", freelancerRouter)
app.use("/api/v1/jobs", jobRouter)
app.use("/api/v1/milestones", milestoneRouter)

export {app, server}