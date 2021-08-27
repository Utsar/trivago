import express from "express"
import UserModel from "../models/user.js"
import { JWTAuthMiddleware, hostsOnly } from "../auth/middlewares.js"
import { getTokens, refreshTokens } from "../auth/tools.js"
import createError from "http-errors"

const UsersRouter = express.Router()

UsersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const savedUser = await newUser.save()
    const { accessToken, refreshToken } = await getTokens(savedUser)
    res.status(201).send({ accessToken, refreshToken, user: savedUser })
  } catch (error) {
    next(createError(400, error))
  }
})

UsersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)
    if (user) {
      const { accessToken, refreshToken } = await getTokens(user)
      res.send({ accessToken, refreshToken })
    } else {
      next(createError(401, "Invalid Credentials"))
    }
  } catch (error) {
    next(createError(500, error))
  }
})

UsersRouter.post("/refreshTokens", async (req, res, next) => {
  const currentRefreshToken = req.body.refreshToken
  if (!currentRefreshToken) return next(createError(404, "Refresh Token must be provided in body: {refreshToken: <token>}"))
  try {
    const { accessToken, refreshToken } = await refreshTokens(currentRefreshToken)
    res.send({ accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
})

UsersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(createError(500, error))
  }
})

UsersRouter.get("/me/accommodation", JWTAuthMiddleware, hostsOnly, async (req, res, next) => {
  try {
    const accommodations = await AccommodationModel.find({
      host: req.user._id,
    }).populate("host")
    res.send(accommodations)
  } catch (error) {
    next(createError(500, error))
  }
})

export default UsersRouter
