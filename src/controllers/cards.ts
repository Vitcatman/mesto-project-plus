import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/notFound';
import BadRequestError from '../errors/badRequest';
import ForbiddenError from '../errors/forbidden';
import { IUserRequest } from '../services/interface';

const { Types } = require('mongoose');

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

export const createCard = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;

  Card.create({ ...req.body, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const deleteCard = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const likeCard = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const dislikeCard = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = Types.ObjectId(req.user?._id);
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};
