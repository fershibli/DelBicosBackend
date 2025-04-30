import mongoose, { Schema, model } from 'mongoose';
import { User } from '../api/';

const userSchema: Schema = new Schema<User>({
  phoneNumber: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  birthDate: { type: String },
  gender: { type: String },
  location: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
});

export default model<User>('User', userSchema);