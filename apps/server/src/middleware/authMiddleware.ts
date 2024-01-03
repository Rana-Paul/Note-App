import { Request, Response, NextFunction } from "express";
import JWTServices, { JWTUser } from "../services/jwt";

// extand the Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTUser;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // get the token from headers
  const token = req.headers.authorization;

  // Check if token is not provided
  if (!token) {
    return res.status(400).json({
      error: "Invalid Not Provided",
    });
  }

  try {
    // Decodeing token
    const data = JWTServices.decodeToken(token);

    if (!data) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};
