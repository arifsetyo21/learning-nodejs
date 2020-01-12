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
         message: err
      });
   }
};

exports.getTourStats = async (req, res) => {
   try {
      const stats = await Tour.aggregate([
         {
            $match: { ratingsAverage: { $gte: 4.5 } }
         },
         {
            $group: {
               _id: { $toUpper: '$difficulty' }, //NOTE _id is like grouping aggregate
               numTours: { $sum: 1 },
               numRatings: { $avg: '$ratingsQuantity' },
               avgRating: { $avg: '$ratingsAverage' },
               avgPrice: { $avg: '$price' },
               minPrice: { $min: '$price' },
               maxPrice: { $max: '$price' }
            }
         },
         {
            $sort: { avgPrice: 1 }
         },
         {
            $match: { _id: { $ne: 'EASY' } }
         }
      ]);

      res.status(200).json({
         status: 'success',
         data: {
            stats
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: 'not found!'
      });
   }
};

module.exports.monthlyPlan = async (req, res) => {
   try {
      const year = req.params.year * 1;
      const plan = await Tour.aggregate([
         {
            // $unwind for devide an array to new array but separate from parent
            $unwind: '$startDates'
         },
         {
            // for matching and filtering
            $match: {
               startDates: {
                  $gte: new Date(`${year}-01-01`),
                  $lte: new Date(`${year}-12-31`)
               }
            }
         },
         {
            // for grouping fields
            $group: {
               _id: { $month: '$startDates' },
               numTourStarts: { $sum: 1 },
               tours: { $push: '$name' }
            }
         },
         {
            // for adding fields
            $addFields: { month: '$_id' }
         },
         {
            // For remove fields
            $project: { _id: 0 }
         },
         {
            // for sorting
            $sort: { numTourStarts: -1 }
         },
         {
            // for limiting output
            $limit: 12
         }
      ]);
      res.status(200).json({
         status: 'success',
         data: {
            plan
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: 'not found!'
      });
   }
};
