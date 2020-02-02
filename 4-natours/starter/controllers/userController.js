const sharp = require('sharp');
const multer = require('multer');
const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
   const newObj = {};
   Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
   });

   return newObj;
};

/* NOTE if want to save image without resizing or process image */
// const multerStorage = multer.diskStorage({
//    destination: (req, file, cb) => {
//       cb(null, 'public/img/users');
//    },
//    filename: (req, file, cb) => {
//       // user-120912098-12091284.jpeg
//       const ext = file.mimetype.split('/')[1];
//       cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//    }
// });

/* NOTE if want to resize image, save photo to memory first */
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      console.log('error upload!, Please upload only image!');
   }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

module.exports.resizeUserPhoto = (req, res, next) => {
   if (!req.file) return next();

   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

   sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

   return next();
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

// TODO  Create function for detail user
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
   console.log(req.file);
   // console.log(req.body);

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
      // NOTE to add image path file to filteredBody object
      if (req.file) filteredBody.photo = req.file.filename;

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

module.exports.deleteMe = async (req, res, next) => {
   try {
      await User.findByIdAndUpdate(req.user.id, { active: false });

      res.status(204).json({
         status: 'success',
         result: null
      });
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         error
      });
   }
};
