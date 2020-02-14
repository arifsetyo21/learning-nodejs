const sharp = require('sharp');
const multer = require('multer');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      console.log('error upload!, Please upload only image!');
   }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

/* NOTE if separate method */
// upload.single('imageCover');
// upload.array('images', 5);

/* NOTE if using 1 method, change with fields */
exports.uploadTourImages = upload.fields([
   {
      name: 'imageCover',
      maxCount: 1
   },
   {
      name: 'images',
      maxCount: 3
   }
]);

exports.resizeTourImages = async (req, res, next) => {
   if (!req.files.imageCover || !req.files.images) return next();

   // 1. Cover image
   req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
   await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

   // 2. Images
   req.body.images = [];
   await Promise.all(
      req.files.images.map(async (file, i) => {
         const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

         await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`);

         req.body.images.push(filename);
      })
   );
   console.log(req.files);
   next();
};

exports.aliasTopTours = async (req, res, next) => {
   req.query.limit = 5;
   req.query.sort = '-ratingsAverage,price';
   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
   next();
};

exports.getAllTours = catchAsync(async function(req, res, next) {
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
});

exports.getTour = catchAsync(async function(req, res, next) {
   console.log(req.params);
   const tour = await Tour.findById(req.params.id);
   /* Tour.findOne({_id: req.params.id}) */

   res.status(200).json({
      status: 'success',
      data: {
         tour
      }
   });
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
   await Tour.findByIdAndDelete(req.params.id);
   /* NOTE 204 mean No Content => There is no content to send for this request */
   return res.status(204).json({
      status: 'success',
      data: null
   });
});

exports.createTour = catchAsync(async (req, res, next) => {
   /* NOTE New way to create new tour */
   const newTour = await Tour.create(req.body);

   res.status(201).json({
      status: 'success',
      data: {
         tour: newTour
      }
   });
   /* NOTE Old way to create new tour
      const newTour = new Tour({
         name: 'Bali Paradise',
         price: 305
      });
   
      newTour.save(); */

   // try {

   // } catch (err) {
   //    res.status(400).json({
   //       status: 'fail',
   //       message: err
   //    });
   // }
});

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
