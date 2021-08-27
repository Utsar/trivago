import express from "express"
import createError from "http-errors"
import { hostsOnly, isOwner, JWTAuthMiddleware } from "../auth/middlewares.js"
import Accommodation from "../models/accommodation.js"

const router = express.Router()

// GET /accommodation
router.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const allAccommodation = await Accommodation.find()
    res.send(allAccommodation)
  } catch (error) {
    next(createError(500, error))
  }
})
//GET /accommodation/:id
router.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id)
    if (!accommodation) return next(createError(404, `Accommodation with id ${req.params.id} not found.`))
    res.send(accommodation)
  } catch (error) {
    next(createError(500, error))
  }
})
//// HOST ONLY

//POST /accommodation
router.post("/", JWTAuthMiddleware, hostsOnly, async (req, res, next) => {
  const { name, description, maxGuests, city } = req.body
  try {
    const accommodation = new Accommodation({
      name,
      description,
      maxGuests,
      city,
      host: req.user.id,
    })
    const newAccommodation = await accommodation.save()
    res.status(201).send(newAccommodation)
  } catch (error) {
    next(createError(400, error))
  }
})

// PUT /accommodation/:id
router.put("/:id", JWTAuthMiddleware, hostsOnly, isOwner, async (req, res) => {
  const { name, description, maxGuests, city } = req.body
  const accommodation = req.accommodation
  // Ask if there is a better way to perform the checks below
  if (name) accommodation.name = name
  if (description) accommodation.description = description
  if (maxGuests) accommodation.maxGuests = maxGuests
  if (city) accommodation.city = city
  try {
    await accommodation.save()
    res.json(accommodation)
  } catch (error) {
    next(createError(400, error))
  }
})

// DELETE /accommodation/:id

router.delete("/:id", JWTAuthMiddleware, hostsOnly, isOwner, async (req, res) => {
  try {
    // Ask if there is something like document.delete()
    // Difference between findByIdAndRemove and findByIdAndDelete()
    await Accommodation.findByIdAndRemove(req.params.id)
    res.json({ message: "Deleted" })
  } catch (error) {
    next(createError(500, error))
  }
})
export default router
