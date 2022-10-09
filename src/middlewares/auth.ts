import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../services/interface';
import UnauthorizedError from '../errors/unauthorized';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new UnauthorizedError('Проблемы с токеном');
  }

  req.user = payload;

  next();
};
