import type { NextFunction, Request, Response } from "express";
import TokenService from "../services/token-service.js";

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(); // 
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(); // guest user, no token provided
  }

  try {
    const tokenService = new TokenService();
    const decoded = tokenService.validateAccessToken(token);

    if (decoded && typeof decoded !== "string") {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }
  } catch {
    // ignore errors and proceed as a guest user if token validation fails
  }

  return next();
};