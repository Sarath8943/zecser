// src/utils/token.ts
import jwt from "jsonwebtoken";

// Define TokenPayload interface
interface TokenPayload {
  id: string;
  role?: string;
  iat?: number;  // issued at
  exp?: number;  // expiration time
}

// Validate environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing JWT secrets in environment variables. Please configure ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET."
  );
}

// Token configuration with proper types
interface TokenConfig {
  secret: string;
  options: jwt.SignOptions;
}

const tokenConfig: {
  access: TokenConfig;
  refresh: TokenConfig;
} = {
  access: {
    secret: ACCESS_TOKEN_SECRET,
    options: {
      expiresIn: "15m",
      algorithm: "HS256",
    },
  },
  refresh: {
    secret: REFRESH_TOKEN_SECRET,
    options: {
      expiresIn: "7d",
      algorithm: "HS256",
    },
  },
};

/**
 * Generates an access token
 */
export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    tokenConfig.access.secret,
    tokenConfig.access.options
  );
};

/**
 * Generates a refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    tokenConfig.refresh.secret,
    tokenConfig.refresh.options
  );
};

/**
 * Verifies an access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, tokenConfig.access.secret) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verifies a refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, tokenConfig.refresh.secret) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

/**
 * Extracts token from Authorization header
 */
export const getTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }
  
  const token = parts[1];
  return token || null;
};