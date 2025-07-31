import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (id: string, role: string): string | undefined => {
  try {
    const payload: TokenPayload = { id, role };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    console.error("JWT generation error:", error);
    return undefined;
  }
};
