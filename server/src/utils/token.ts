import jwt from "jsonwebtoken";

// Define the expected payload
interface TokenPayload {
  id: string;
  role: string;
}

// Return type can be string or undefined if an error occurs
export const generateToken = (id: string, role: string): string | undefined => {
  try {
    const payload: TokenPayload = { id, role };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1h", // Optional: token expiry
    });

    return token;
  } catch (error) {
    console.error("JWT generation error:", error);
    return undefined;
  }
};
