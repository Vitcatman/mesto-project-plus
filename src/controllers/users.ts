import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ConflictError from '../errors/conflictError';
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

export const getCurrentUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Некорректный формат e-mail'));
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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }) });
    })
    .catch(next);
};
