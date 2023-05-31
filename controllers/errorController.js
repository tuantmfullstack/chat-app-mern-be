import AppError from '../utils/appError.js';

const castErrorHandler = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const validatorErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  return new AppError('Validation fail: ' + errors.join(', '), 400);
};

const duplicateFieldHandler = (err) => {
  return new AppError(
    `This ${Object.keys(err.keyValue)} : ${Object.values(
      err.keyValue
    )} existed! Please use different email.`
  );
};

const tokenExpireHandler = (err) =>
  new AppError('Your token expired. Please login again!', 401);

const jwtErrorHandler = (err) =>
  new AppError('Invalid token. Please login again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(500).json({
    status: 'Something went wrong!',
    message: err.message,
  });
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.name = err.name;
    error.code = err.code;
    error.message = err.message;

    if (error.name === 'CastError') error = castErrorHandler(error);
    if (error.name === 'ValidationError') error = validatorErrorHandler(error);
    if (error.name === 'TokenExpiredError') error = tokenExpireHandler(error);
    if (error.name === 'JsonWebTokenError') error = jwtErrorHandler(error);
    if (error.code === 11000) error = duplicateFieldHandler(error);

    sendErrorProd(error, res);
  }
};

export default errorController;
