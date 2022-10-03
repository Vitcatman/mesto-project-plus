import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/notFound';
import BadRequestError from '../errors/badRequest';
import { IUserRequest } from '../services/interface';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  User.create(req.body)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const updateUser = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const updateAvatar = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  const { avatar } = req.body.avatar;

  User.findByIdAndUpdate(userId, avatar, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};
