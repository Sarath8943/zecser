import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token;
    console.log("Token received:", token);

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const tokenDecoded = jwt.verify(token, secret) as JwtPayload;

    if (!tokenDecoded || typeof tokenDecoded !== "object" || !tokenDecoded.id || !tokenDecoded.role) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    req.user = {
      id: tokenDecoded.id as string,
      role: tokenDecoded.role as string,
    };

    next();
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default authMiddleware;
