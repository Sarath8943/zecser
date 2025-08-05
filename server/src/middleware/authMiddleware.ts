import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


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
): any => {
  try {
   
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : cookieToken;

    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }


    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

  
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    console.error("Auth Error:", error.message);

    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default authMiddleware;
