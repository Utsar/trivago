import createError from "http-errors"
import UserModel from "../models/user.js"
import AccommodationModel from "../models/accommodation.js"
import { verifyJWT } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) return next(createError(401, "Please provide credentials in the authorization header."))

  const token = req.headers.authorization.replace("Bearer ", "")

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

export const isOwner = async (req, res, next) => {
  const accommodation = await AccommodationModel.findById(req.params.id)
  if (!accommodation) return next(createError(400, `Accommodation with id ${req.params.id} not Found`))
  if (accommodation.host.toString() !== req.user.id) return next(createError(403, `No access to this accommodation`))
  req.accommodation = accommodation
  next()
}
