/* 4. SERVER */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE_MONGO.replace(
   '<PASSWORD>',
   process.env.DATABASE_PASSWORD
);

mongoose
   .connect(DB, {
      userNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
   })
   .then(() => {
      // console.log(conn.connections);
      console.log('db connection successfuly');
   });

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

/* NOTE Creating model for  */
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
   name: 'The Park Camper',
   price: 997
});

testTour
   .save()
   .then(doc => {
      console.log(doc);
   })
   .catch(err => console.log('======ERROR======', err));

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
