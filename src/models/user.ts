import {
  Schema, model,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../errors/unauthorized';
import { IUser, IUserModel } from '../services/interface';
import urlRegexp from '../helpers/urlRegexp';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, 'Поле должно содержать от 2 до 30 символов'],
      maxlength: [30, 'Поле должно содержать от 2 до 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Поле должно содержать от 2 до 200 символов'],
      maxlength: [200, 'Поле должно содержать от 2 до 200 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v: string) => urlRegexp.test(v),
        message: 'Некорректная ссылка',
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный формат',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .select('+password').then((user: IUser | null) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неверная почта или пароль'));
          }
          return user;
        });
    });
});

export default model<IUser, IUserModel>('user', userSchema);
