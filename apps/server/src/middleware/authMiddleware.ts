import { Request, Response, NextFunction } from "express";
import JWTServices, { JWTUser } from "../services/jwt";

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
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Invalid Not Provided",
    });
  }

  try {
    const data = JWTServices.decodeToken(token);

    if (!data) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
