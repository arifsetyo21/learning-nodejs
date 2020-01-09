const mongoose = require('mongoose');

/* NOTE Create schema creating model  */
const tourSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'a tour must have a name'], //Validation
      unique: true
   },
   rating: {
      type: Number,
      default: 4.5
   },
   price: {
      type: Number,
      required: [true, 'a tour must have a price']
   }
});

/* NOTE Create tour model with schema tourSchema */
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
