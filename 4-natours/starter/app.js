const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const dotenv = require('dotenv');
const indexRouter = require('./routers/index');

dotenv.config({ path: './.env' });
const app = express();

/* 1. GLOBAL MIDDLEWARE */

// Set securing HTTP headers
app.use(helmet());

/* NOTE This is middleware for all routes */
/* NOTE using 3rd party mi */
/* NOTE create diffrent run if in development and production */
// Development logging
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}

// NOTE Create limiter for limit request user per IP with express-rate-limit
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,
   message: 'Too many request from this IP, please try again in an hour'
});

// Limiting request from same IP
app.use('/api', limiter);

/* NOTE This is how use middleware in express */
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter
app.use(
   hpp({
      whitelist: [
         'duration',
         'ratingsQuantity',
         'ratingsAverage',
         'maxGroupSize',
         'difficulty',
         'price'
      ]
   })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

/* NOTE Creating own middleware for first time, with Hello */
// Test middleware
app.use((req, res, next) => {
   console.log('Hello from middleware!!!');
   next();
});

/* NOTE Creating own middleware to manipulate response and request */
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   // Check availibility token
   console.log(req.headers);
   next();
});

/* 2. CONTROLLERS */

/* NOTE Refactoring routes solution 1 */
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.post('/api/v1/tours', createTour);

/* 3. ROUTING */
/* NOTE This is middleware for spesifict routes */
/* NOTE Refactoring 4 route solution, Manage file structure with separate routing to other directory */
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
app.use('/api/v1', indexRouter);

/* NOTE Refactoring route solution 3 with route mounting middleware/group routing if in laravel */

/* NOTE Refactoring routes solution 2 */

/* NOTE Adding user route resource */

/* NOTE Refactoring route solution 3 with route mounting middleware/group routing if in laravel */

module.exports = app;
