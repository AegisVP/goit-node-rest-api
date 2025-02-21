import HttpError from './HttpError.js';

export const validateQuery = schema => {
  const func = (req, _, next) => {
    const validateOptions = { abortEarly: false };
    const { error } = schema.validate(req.query, validateOptions);

    return error ? next(HttpError(400, error.message)) : next();
  };

  return func;
};
