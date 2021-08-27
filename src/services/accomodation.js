import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const accomodationSchema = new Schema({
  name: reqString,
  host: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  descrption: reqString,
  maxGuests: {
    type: Number,
    required: true,
  },
  city: reqString,
});

export default model('Accomodation', accomodationSchema);
