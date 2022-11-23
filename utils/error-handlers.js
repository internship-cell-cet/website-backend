export const defaultErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // create a generic error response object
  const errorResponse = { message: (err && err.message) || 'Something went wrong! Please try again.' };

  return res.status(500).json(errorResponse);
};
