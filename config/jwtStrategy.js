import passport from 'passport';
import passportJWT from 'passport-jwt';
import { User } from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import { constants } from './constants.js';

const params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new passportJWT.Strategy(params, async (payload, done) => {
    const user = await User.findByPk(payload.id);
    if (!user) {
      return done(HttpError(401));
    }
    if (user.email !== payload.email) {
      return done(HttpError(401));
    }
    if (!user.token) {
      return done(HttpError(401));
    }
    if (payload.iat + constants.jwt.validFor > Date.now()) {
      return done(HttpError(401));
    }
    done(null, user);
  })
);

export default passport;
