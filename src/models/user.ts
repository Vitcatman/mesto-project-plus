import { Schema, model } from "mongoose";
import { IUser } from "../services/interface";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Обязательное поле"],
    minlength: [2, "Поле должно содержать от 2 до 30 символов"],
    maxlength: [30, "Поле должно содержать от 2 до 30 символов"],
  },
  about: {
    type: String,
    minlength: [2, "Поле должно содержать от 2 до 200 символов"],
    maxlength: [200, "Поле должно содержать от 2 до 200 символов"],
    required: [true, "Обязательное поле"],
  },
  avatar: {
    type: String,
    required: [true, "Обязательное поле"],
  },
},
{
  versionKey: false
});

export default model<IUser>("user", userSchema);
