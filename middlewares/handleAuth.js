import passport from '../config/jwtStrategy.js';
import HttpError from '../helpers/HttpError.js';

export const handleAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const reqToken = req.headers.authorization?.split(' ')[1];
    if (err || !user || user.token !== reqToken) {
      return next(HttpError(401));
    }
    if (user.emailVerified === false) {
      return next(HttpError(401, 'Email not verified'));
    }
    req.user = user;
    next();
  })(req, res, next);
};
