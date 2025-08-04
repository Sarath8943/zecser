import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  forgotPasswordToken?: string;
  forgotPasswordExpires?: Date;
  role: 'user' | 'employer' | 'admin' | 'superAdmin';
  isEmailVerified?: boolean; // ✅ Add this to the interface
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    forgotPasswordToken: { type: String },
    forgotPasswordExpires: { type: Date },
    role: {
      type: String,
      enum: ['user', 'employer', 'admin', 'superAdmin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false, // ✅ Unverified by default
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
