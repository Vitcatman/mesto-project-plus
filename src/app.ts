import express from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi, errors } from 'celebrate';
import errorHandler from './middlewares/errorHandler';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import urlRegexp from './helpers/urlRegexp';
import router from './routes/index';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri().pattern(urlRegexp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);
// @ts-ignore
app.use(auth as express.RequestHandler);

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
