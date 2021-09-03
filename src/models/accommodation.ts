import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const accommodationSchema = new Schema({
  name: reqString,
  host: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  description: reqString,
  maxGuests: {
    type: Number,
    required: true,
  },
  city: reqString,
});

export default model('Accommodation', accommodationSchema);
