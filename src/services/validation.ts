import {
  Request,
  Response,
  NextFunction,
} from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import NotFoundError from '../errors/notFound';
import urlRegexp from '../helpers/urlRegexp';

export const validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    link: Joi.string().uri().pattern(urlRegexp),
  }),
});
export const validationUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().pattern(urlRegexp),
    about: Joi.string().min(2).max(200),
  }),
});
export const validationAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().pattern(urlRegexp),
  }),
});
export const validationId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Некорректный идентификатор');
  }
  next();
};
