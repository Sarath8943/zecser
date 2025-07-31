"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpExpiry = exports.generateOtp = void 0;
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
const otpExpiry = () => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return expiry;
};
exports.otpExpiry = otpExpiry;
//# sourceMappingURL=otp.js.map