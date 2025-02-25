import HttpError from '../helpers/HttpError';

export const notEmpty = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(HttpError(400, 'Request body can not be empty'));
  }
  next();
};
