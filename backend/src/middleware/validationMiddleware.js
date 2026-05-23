import { AppError } from '../utils/errorHandler.js';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error.errors) {
        const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        throw new AppError(messages.join(', '), 400);
      }
      next(error);
    }
  };
};
