import express from 'express';
import { JWTAuthMiddleware } from '../auth/middlewares';
import Accommodation from '../models/accommodation';

const router = express.Router();

// GET /accommodation
router.get('/accommodation', async (req, res) => {
  try {
    const allAccommodation = await Accommodation.find();
    return allAccommodation;
  } catch (error) {
    res.status(400).send('Server error');
  }
});
//GET /accommodation/:id
router.get('/accommodation/:id', async (req, res) => {
  try {
    const allAccommodationById = await Accommodation.findById(req.params.id);
    return allAccommodationById;
  } catch (error) {
    res.status(400).send('Server error');
  }
});
//// HOST ONLY

//GET /user/me/accommodation
router.get('/me/accommodation', async (req, res) => {
  try {
    const allAccommodationById = await Accommodation.findById(req.params.id);
    return allAccommodationById;
  } catch (error) {
    res.status(400).send('Server error');
  }
});
//POST /accommodation
router.post('/accommodation', async (req, res) => {
  const { name, description, maxGuests, city } = req.body;
  try {
    const accommodation = new Accommodation({
      name,
      description,
      maxGuests,
      city,
      host: req.user.id,
    });
    const newAccommodation = await accommodation.save();
    res.send(newAccommodation);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});
// PUT /accommodation/:id
router.put('/accommodation/:id', async (req, res) => {
  const { name, description, maxGuests, city } = req.body;
  const editAccommodation = {};
  if (name) editAccommodation.name = name;
  if (description) editAccommodation.description = description;
  if (maxGuests) editAccommodation.maxGuests = maxGuests;
  if (city) editAccommodation.city = city;
  try {
    let accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) return res.status(400).json({ message: 'Not Found' });
    if (accommodation.host.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      { $set: editAccommodation },
      { new: true }
    );
    res.json(accommodation);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});
// DELETE /accommodation/:id

router.delete('/accommodation/:id', async (req, res) => {
  try {
    let accommodation = Accommodation.findById(req.params.id);
    if (!accommodation)
      return res.status(400).json({ message: 'Accommodation not found' });
    if (accommodation.host.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await Accommodation.findByIdAndRemove(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});
