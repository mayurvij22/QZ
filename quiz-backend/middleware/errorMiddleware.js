
// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;

  // Only log stack traces in development
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack || err);
  } else {
    console.error(err.message);
  }

  res.status(status).json({
    success: false,
    status,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;


// // middleware/errorMiddleware.js
// const errorHandler = (err, req, res, next) => {
//   console.error(err);
//   const status = err.status || 500;
//   res.status(status).json({ message: err.message || 'Server error' });
// };

// module.exports = errorHandler;

