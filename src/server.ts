import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { errorsMiddleware } from "./errors/errorsMiddlewares"
import usersRouter from "./services/user"
import accommodationsRouter from "./services/accommodation"

const PORT = process.env.PORT
const server = express()

// MIDDLEWARES
server.use(express.json())
server.use(cors())

// ENDPOINTS
server.use("/users", usersRouter)
server.use("/accommodation", accommodationsRouter)

// ERROR MIDDLEWARES
server.use(errorsMiddleware)

mongoose
  .connect(process.env.MONGO_STRING)
  .then(() => server.listen(PORT, () => console.log("Server running on port " + PORT)))
  .catch(err => console.log(err.message))
