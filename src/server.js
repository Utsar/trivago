import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { errorsMiddleware } from "./errors/errorsMiddlewares.js"
import usersRouter from "./services/user.js"
import accommodationsRouter from "./services/accommodation.js"
import googleStrategy from "./auth/oauth/google.js"
import passport from "passport"

const PORT = process.env.PORT
const server = express()
passport.use("google", googleStrategy)

// MIDDLEWARES
server.use(express.json())
server.use(cors())
server.use(passport.initialize())

// ENDPOINTS
server.use("/users", usersRouter)
server.use("/accommodation", accommodationsRouter)

// ERROR MIDDLEWARES
server.use(errorsMiddleware)

mongoose.set("returnOriginal", false)
mongoose
  .connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => server.listen(PORT, () => console.log("Server running on port " + PORT)))
  .catch(err => console.log(err.message))
