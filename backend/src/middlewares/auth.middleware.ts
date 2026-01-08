import type { NextFunction, Request, Response } from "express";
import ErrorHandler from "../exeptions/errorHandlung.js";
import TokenService from "../services/token-service.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return next(
        ErrorHandler.UnauthorizedError(
          "Es wurde kein Autorisierungsheader bereitgestellt."
        )
      );

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken)
      return next(
        ErrorHandler.UnauthorizedError(
          "Es wurde kein Zugriffstoken bereitgestellt."
        )
      );
    const tokenService = new TokenService();
    const decoded = tokenService.validateAccessToken(accessToken);
    if (!decoded || typeof decoded === "string")
      return next(
        ErrorHandler.UnauthorizedError("Token abgelaufen oder ungültig")
      );
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    next(err);
  }
};
