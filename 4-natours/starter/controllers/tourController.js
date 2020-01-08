const fs = require('fs');

const tours = JSON.parse(
   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/* NOTE Creating validation with middleware */
exports.checkId = function(req, res, next, val) {
   if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
         status: 'fail',
         message: 'invalid ID'
      });
   }
   next();
};

exports.checkBody = function(req, res, next) {
   if (!req.body.name || !req.body.price) {
      return res.status(400).json({
         status: 'fail',
         message: 'missing name and price property'
      });
   }
   next();
};

exports.getAllTours = function(req, res) {
   /* NOTE data : tours is shorthand type if we has same variable name between key pair */
   return res.status(200).json({
      status: 'success',
      result: tours.length,
      requestAt: req.requestTime,
      data: {
         tours
      }
   });
};

exports.getTour = function(req, res) {
   console.log(req.params);

   /* NOTE request spesific data with id param */
   /* NOTE * 1 will convert string like integer to integer data type */
   const id = req.params.id * 1;

   /* NOTE find object with id object, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find */
   const tour = tours.find(el => el.id === id);

   // if (id > tours.length) {
   /* NOTE  if tour not found, its will return undefined */
   // if (!tour) {
   //    return res.status(404).json({
   //       status: 'fail',
   //       message: 'Invalid ID'
   //    });
   // }

   return res.status(200).json({
      status: 'success',
      data: {
         tour
      }
   });
};

exports.updateTour = (req, res) => {
   /* NOTE 201 mean created */
   return res.status(201).json({
      status: 'success',
      data: {
         tour: '<Updated tour here>'
      }
   });
};

exports.deleteTour = (req, res) => {
   /* NOTE 204 mean No Content => There is no content to send for this request */
   return res.status(204).json({
      status: 'success',
      data: null
   });
};

exports.createTour = (req, res) => {
   const newId = tours[tours.length - 1].id + 1;
   const newTour = Object.assign(`{ id: ${newId} }`, req.body);

   tours.push(newTour);

   fs.writeFile(
      `${__dirname}/../../dev-data/data/tours-simple.json`,
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
