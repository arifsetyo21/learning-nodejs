const mongoose = require('mongoose');
const slugify = require('slugify');

/* NOTE Create schema creating model  */
const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'a tour must have a name'], //Validation
         unique: true
      },
      slug: {
         type: String,
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
      startDates: [Date],
      secretTour: {
         type: Boolean,
         default: false
      }
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

tourSchema.virtual('durationWeeks').get(function() {
   return this.duration / 7;
});

// Document Middleware or Hook, runs before .save() and .create()
tourSchema.pre('save', function(next) {
   this.slug = slugify(this.name, { lower: true });
   next();
   // console.log(this);
});

// NOTE Document middleware
// tourSchema.pre('save', function(next) {
//    console.log('will save document');
//    next();
// });

// tourSchema.post('save', function(doc, next) {
//    console.log(doc);
//    next();
// });

// NOTE Query Middleware
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
   //with regular expression, /^find/ this will filter the query method which start with find, like findOne, findOrCreate, findAll
   this.find({ secretTour: { $ne: true } });

   this.start = Date.now();
   next();
});

tourSchema.post(/^find/, function(doc, next) {
   console.log(`Query took ${Date.now() - this.start} milisecond!`);
   next();
});

/* NOTE Create tour model with schema tourSchema */
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
