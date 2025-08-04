import { Schema, Document,model } from "mongoose";


export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}
const OtpSchema = new Schema<IOTP>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default model<IOTP>("Otp", OtpSchema);