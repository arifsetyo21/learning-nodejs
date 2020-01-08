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

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
