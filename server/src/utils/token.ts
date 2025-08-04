// src/utils/token.ts

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
export const generateTokens = (userId: string, role: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error("JWT_SECRET or JWT_REFRESH_SECRET is not defined in environment variables");
  }

  const accessToken = jwt.sign(
    { id: userId, role },
    jwtSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId, role },
    jwtRefreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
