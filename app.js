const path = require('path');
const express = require('express');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const sanitize = require('express-mongo-sanitize');
const foodRouter = require('./routes/foodRoutes');
const userRouter = require('./routes/userRoutes');
const discountRouter = require('./routes/discountRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const reviewRouter = require('./routes/ReviewRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files

app.use(express.static(path.join(__dirname, 'public')));

//Logging in Development Environment

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit Request from API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Reading data from body to req.body

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '60kb' }));

// reading Data from cookie

app.use(cookieParser());

// Data Sanitisation against NoSQL query injecton

app.use(sanitize());

// Data Sanitisation against XSS

app.use(xss());

//Routes

app.use('/api/v1/foods', foodRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/discount', discountRouter);

app.use(globalErrorHandler);

module.exports = app;
