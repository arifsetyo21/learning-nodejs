const fs = require('fs');
const express = require('express');

const app = express();

/* NOTE This is how use middleware in express */
app.use(express.json());

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

app.post('/api/v1/tours', (req, res) => {
   const newId = tours[tours.length - 1].id + 1;
   const newTour = Object.assign({ id: newId }, req.body);

   tours.push(newTour);

   fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      err => {
         res.status(201).json({
            status: 'success',
            data: {
               tour: newTour
            }
         });
      }
   );
});

app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
