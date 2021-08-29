import createError from "http-errors"
import UserModel from "../models/user.js"
import { verifyJWT } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.cookies.accessToken) return next(createError(401, "Please provide credentials in cookies."))

  const token = req.cookies.accessToken
  try {
    const decodedToken = await verifyJWT(token)
    const user = await UserModel.findById(decodedToken._id)
    if (!user) return next(createError(404, "User not found."))
    req.user = user
    next()
  } catch (error) {
    next(createError(401, "Invalid token"))
  }
}

export const hostsOnly = async (req, res, next) => {
  const user = req.user
  if (user.role === "host") next()
  else next(createError(403, "Access to hosts only"))
}
