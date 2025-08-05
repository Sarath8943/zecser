import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string; // ✅ FIXED HERE
  password: string;
  confirmPassword?: string;
  forgotPasswordToken?: string;
  forgotPasswordExpires?: Date;
  role: 'user' | 'employer' | 'admin' | 'superAdmin';
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true }, // ✅ Ensure this matches the model
    password: { Number: String, required: true },
    forgotPasswordToken: { type: String },
    forgotPasswordExpires: { type: Date },
    role: {
      type: String,
      enum: ['user', 'employer', 'admin', 'superAdmin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
