import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import postRoutes from "./services/posts/index.js"
import experienceRouter from "./services/experience/index.js"
import { notFoundHandler, badRequestHandler, genericErrorHandler } from "./errorHandlers.js"
/////////////////////////////////
import profileRouter from "./services/profiles/index.js"

const server = express()
const port = process.env.PORT || 3001

// ***************** CORS ***********************
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOpts = {
    origin: function (origin, next) {
        console.log("CURRENT ORIGIN: ", origin)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            // if received origin is in the whitelist we are going to allow that request
            next(null, true)
        } else {
            // if it is not, we are going to reject that request
            next(new Error(`Origin ${origin} not allowed!`))
        }
    },
}

// ************************* MIDDLEWARES ********************************

server.use(cors(corsOpts))
server.use(express.json())

// ************************* ROUTES ************************************

server.use("/experiences", experienceRouter)
server.use("/profiles", profileRouter)
server.use("/posts", postRoutes)

// ************************** ERROR HANDLERS ***************************

server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Successfully connected to Mongo!")
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`Server running on port ${port}`)
    })
})

mongoose.connection.on("error", err => {
    console.log(err)
})