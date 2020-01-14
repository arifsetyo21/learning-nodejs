const User = require('./../models/userModel');

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
