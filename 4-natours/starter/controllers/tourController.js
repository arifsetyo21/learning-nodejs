const fs = require('fs');

const tours = JSON.parse(
   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = function(req, res) {
   /* NOTE data : tours is shorthand type if we has same variable name between key pair */
   res.status(200).json({
      status: 'success',
      result: tours.length,
      requestAt: req.requestTime,
      data: {
         tours
      }
   });
};

exports.getTour = function(req, res) {
   /* NOTE request spesific data with id param */
   /* NOTE * 1 will convert string like integer to integer data type */
   const id = req.params.id * 1;

   /* NOTE find object with id object, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find */
   const tour = tours.find(el => el.id === id);

   // if (id > tours.length) {
   /* NOTE  if tour not found, its will return undefined */
   if (!tour) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      });
   }

   res.status(200).json({
      status: 'success',
      data: {
         tour
      }
   });
};

exports.updateTour = (req, res) => {
   if (req.params.id > tours.length) {
      res.status(404).json({
         status: 'fail',
         message: 'invalid ID'
      });
   }

   /* NOTE 201 mean created */
   res.status(201).json({
      status: 'success',
      data: {
         tour: '<Updated tour here>'
      }
   });
};

exports.deleteTour = (req, res) => {
   if (req.params.id > tours.length) {
      res.status(404).json({
         status: 'fail',
         message: 'invalid ID'
      });
   }

   /* NOTE 204 mean No Content => There is no content to send for this request */
   res.status(204).json({
      status: 'success',
      data: null
   });
};

exports.createTour = (req, res) => {
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
};
