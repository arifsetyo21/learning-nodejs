const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = async (req, res, next) => {
   req.query.limit = 5;
   req.query.sort = '-ratingsAverage,price';
   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
   next();
};

exports.getAllTours = async function(req, res) {
   try {
      // BUILD QUERY
      const features = new APIFeatures(Tour.find(), req.query)
         .filter()
         .sort()
         .limit()
         .paginate();

      // EXECUTE QUERY
      const tours = await features.query;

      // SEND RESPONSE
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

exports.updateTour = async (req, res) => {
   try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      });
      /* NOTE 201 mean created */
      return res.status(201).json({
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

exports.deleteTour = async (req, res) => {
   try {
      await Tour.findByIdAndDelete(req.params.id);
      /* NOTE 204 mean No Content => There is no content to send for this request */
      return res.status(204).json({
         status: 'success',
         data: null
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: 'not found!',
         error
      });
   }
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
