// utils/token.ts
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};




