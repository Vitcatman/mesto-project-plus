import { Schema, model } from 'mongoose';
import urlRegexp from '../helpers/urlRegexp';
import { ICard } from '../services/interface';

const cardsSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => urlRegexp.test(v),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<ICard>('card', cardsSchema);
