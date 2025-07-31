import mongoose, { Document } from "mongoose";
export interface IOtp extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
    attempts: number;
    verified: boolean;
}
declare const OtpModel: mongoose.Model<IOtp, {}, {}, {}, mongoose.Document<unknown, {}, IOtp, {}> & IOtp & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default OtpModel;
//# sourceMappingURL=otpModel.d.ts.map