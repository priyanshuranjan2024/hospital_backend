class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

//we will use this error middleware in the app.js and it should e used  at last so that
//it doesn't so unwanted behaviour

//this function will catch the error and send the response
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  //if the error is due to same values in the database
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //if json web token is invalid
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid Token, Please Login Again";
    err = new ErrorHandler(message, 401);
  }

  //if json web token is expired
  if (err.name === "TokenExpiredError") {
    const message = "Token Expired, Please Login Again";
    err = new ErrorHandler(message, 401);
  }

  //if the error is due to wrong data entered
  //that is cast error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 404);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  //now return this
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

//now export the error handler
export default ErrorHandler;
