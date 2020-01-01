const fs = require('fs');
const express = require('express');

const app = express();

const port = 8000;

const tours = JSON.parse(
   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', function(req, res) {
   /* NOTE data : tours is shorthand type if we has same variable name between key pair */
   res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
         tours
      }
   });
});

app.post('/', (req, res) => {
   res.status(200).send('you can post to this endpoint');
});

app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
