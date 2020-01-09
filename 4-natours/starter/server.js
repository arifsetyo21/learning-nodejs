/* 4. SERVER */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './.env' });

/* NOTE Mongodb local */
const DB_LOCAL = process.env.DATABASE_MONGO_LOCAL;

/* NOTE Mongodb free from mongodb.com */
const DB = process.env.DATABASE_MONGO.replace(
   '<PASSWORD>',
   process.env.DATABASE_PASSWORD
);

mongoose
   .connect(DB_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
   })
   .then(() => {
      // console.log(conn.connections);
      console.log('db connection successfuly');
   })
   .catch(error => {
      console.log(error);
      mongoose
         .connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
         })
         .then(() => {
            // console.log(conn.connections);
            console.log('db connection local successfuly');
         });
   });

// const testTour = new Tour({
//    name: 'The Park Camper',
//    rating: 4.7,
//    price: 997
// });

// testTour
//    .save()
//    .then(doc => {
//       console.log(doc);
//    })
//    .catch(err => console.log('======ERROR======', err));

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
