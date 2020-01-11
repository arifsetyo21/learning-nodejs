const Tour = require('./../models/tourModel');

exports.getAllTours = async function(req, res) {
   try {
      // BUILD QUERY
      // 1A. Filtering Basic
      const queryObj = { ...req.query };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);
      console.log(queryObj);

      // 1B. Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      console.log(JSON.parse(queryStr));

      let query = Tour.find(JSON.parse(queryStr));

      // 2. Sorting
      if (req.query.sort) {
         const sortBy = req.query.sort.split(',').join(' ');
         query = query.sort(sortBy);
      } else {
         query = query.sort('-createdAt');
      }

      // 3. Limiting Output Fields
      if (req.query.fields) {
         const fields = req.query.fields.split(',').join(' ');
         query = query.select(fields);
      } else {
         query = query.select('-__v');
      }

      // EXECUTE QUERY
      const tours = await query;

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
