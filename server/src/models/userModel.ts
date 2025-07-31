
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  forgotPasswordToken?: string;
  role: 'user' | 'employer' | 'admin' | 'superAdmin';
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    forgotPasswordToken: { type: String },
    role: {
      type: String,
      enum: ['user', 'employer', 'admin', 'superAdmin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
