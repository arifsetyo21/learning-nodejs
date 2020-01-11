const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './.env' });

// const DB = process.env.DATABASE_MONGO.replace(
//    '<PASSWORD>',
//    process.env.DATABASE_PASSWORD
// );

const DB_LOCAL = process.env.DATABASE_MONGO_LOCAL;

mongoose
   .connect(DB_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
   })
   .then(() => console.log('DB Connection Successfully'));

// Read JSON File
const tours = JSON.parse(
   fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT Data to DATABASE
const importData = async () => {
   try {
      await Tour.create(tours);
      console.log('Data sucessfully loaded!');
   } catch (error) {
      console.log(error);
   }
};

// Delete Data from DB
const deleteData = async () => {
   try {
      await Tour.deleteMany();
      console.log('Data sucessfully deleted!');
   } catch (error) {
      console.log(error);
   }
};

if (process.argv[2] === '---import') {
   importData();
} else if (process.argv[2] === '---delete') {
   deleteData();
}

console.log(process.argv);
