"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otpController_1 = require("../controllers/otpController");
const router = express_1.default.Router();
router.post('/generate', otpController_1.requestOTP);
router.post('/verify', otpController_1.verifyOTP);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map