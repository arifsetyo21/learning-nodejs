const Tour = require('./../models/tourModel');

exports.getAllTours = async function(req, res) {
   try {
      const tours = await Tour.find();
      /* NOTE data : tours is shorthand type if we has same variable name between key pair */
      res.status(200).json({
         status: 'success',
         result: tours.length,
         data: {
            tours
         }
      });
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         message: error
      });
   }
};

exports.getTour = async function(req, res) {
   console.log(req.params);
   try {
      const tour = await Tour.findById(req.params.id);
      /* Tour.findOne({_id: req.params.id}) */

      res.status(200).json({
         status: 'success',
         data: {
            tour
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: 'not found!'
      });
   }
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

exports.createTour = async (req, res) => {
   try {
      /* NOTE Old way to create new tour
      const newTour = new Tour({
         name: 'Bali Paradise',
         price: 305
      });
   
      newTour.save(); */

      /* NOTE New way to create new tour */
      const newTour = await Tour.create(req.body);

      res.status(201).json({
         status: 'success',
         data: {
            tour: newTour
         }
      });
   } catch (err) {
      res.status(400).json({
         status: 'fail',
         message: 'invalid data sent!'
      });
   }
};
