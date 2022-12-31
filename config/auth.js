const checkAuthentication = (req, res, next) => {
  // req.isAuthenticated() will return true if user is logged in
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: 'You are not authorized to make this request',
    });
  }
  return next();
};

export default checkAuthentication;
