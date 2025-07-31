"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, role) => {
    try {
        const payload = { id, role };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        });
        return token;
    }
    catch (error) {
        console.error("JWT generation error:", error);
        return undefined;
    }
};
exports.generateToken = generateToken;
//# sourceMappingURL=token.js.map