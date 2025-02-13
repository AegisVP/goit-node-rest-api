import HttpError from './HttpError.js';

const validateBody = schema => {
  const func = (req, _, next) => {
    const validateOptions = { abortEarly: false };
    const { error } = schema.validate(req.body, validateOptions);

    return error ? next(HttpError(400, error.message)) : next();
  };

  return func;
};

export default validateBody;
