const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
   const newObj = {};
   Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
   });

   return newObj;
};

exports.getAllUsers = async (req, res) => {
   try {
      // EXECUTE QUERY
      const users = await User.find();

      // SEND RESPONSE
      /* NOTE data : tours is shorthand type if we has same variable name between key pair */
      res.status(200).json({
         status: 'success',
         result: users.length,
         data: {
            users
         }
      });
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         message: error
      });
   }
};

exports.createUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};
exports.getUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};
exports.updateUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};
exports.deteleUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};

exports.updateMe = async (req, res, next) => {
   try {
      // 1. Create error if user request POSTs password data
      if (req.body.password || req.body.passwordConfirm) {
         return next(
            res.status(400).json({
               status: 'fail',
               message:
                  'this routes is not for password updates, Please use /updateMyPassword'
            })
         );
      }
      // 2. Filtered out unwanted fields name that are not allowed to be updated
      const filteredBody = filterObj(req.body, 'name', 'email');

      // 3. Update user document
      const updatedUser = await User.findByIdAndUpdate(
         req.user.id,
         filteredBody,
         { new: true, runValidators: true }
      );

      res.status(200).json({
         status: 'success',
         result: updatedUser
      });
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         error
      });
   }
};
