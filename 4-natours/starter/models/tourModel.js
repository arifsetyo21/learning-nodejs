const mongoose = require('mongoose');

/* NOTE Create schema creating model  */
const tourSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'a tour must have a name'], //Validation
      unique: true
   },
   duration: {
      type: Number,
      required: [true, 'A tour must have duration']
   },
   maxGroupSize: {
      type: Number,
      require: [true, 'A tour must have a group size']
   },
   difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty']
   },
   ratingsAverage: {
      type: Number,
      default: 4.5
   },
   ratingsQuantity: {
      type: Number,
      default: 0
   },
   price: {
      type: Number,
      required: [true, 'a tour must have a price']
   },
   priceDiscount: Number,
   summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
   },
   description: {
      type: String,
      trim: true
   },
   imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
   },
   images: [String],
   createdAt: {
      type: Date,
      default: Date.now()
   },
   updatedAt: {
      type: Date,
      default: Date.now()
   },
   startDates: [Date]
});

/* NOTE Create tour model with schema tourSchema */
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
