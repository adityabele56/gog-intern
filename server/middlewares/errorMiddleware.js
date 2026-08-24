export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
    return res.status(400).json({
      success: false,
      message,
      data: null
    });
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message,
      data: null
    });
  }

  // Handle JWT Error
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid authentication token';
    return res.status(401).json({
      success: false,
      message,
      data: null
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
