import { Request } from 'express';
import { ObjectId, Model, Document } from 'mongoose';
import jwt from 'jsonwebtoken';

export interface IUser {
  name: string;
  about: string;
  avatar?: string;
  email: string,
  password: string,
}

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
}

export interface IUserRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface IError extends Error {
  statusCode: number;
  code?: number;
}

export interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<IUser>>
}

export interface IAuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}
