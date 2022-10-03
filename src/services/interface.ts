import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar?: string;
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
