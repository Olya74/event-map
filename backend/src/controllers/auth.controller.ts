import type { NextFunction, Request, Response } from "express";
import authService from "../services/auth-service.js";
import type { HCaptchaResponse } from "../models/HCaptchaResponse.js";
import ErrorHandler from "../exeptions/errorHandlung.js";


const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, captcha } = req.body;
    if (!name || !email || !password || !captcha) {
      throw ErrorHandler.BadRequestError(
        "REGISTRATION ERROR: Name, email, password, and captcha are required!"
      );
    }
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `response=${captcha}&secret=${process.env.HCAPTCHA_SECRET}`,
    });

    const data = (await response.json()) as HCaptchaResponse;
    if (!data.success) {
      throw ErrorHandler.BadRequestError("Captcha verification failed");
    }

    const userData = await authService.registration(name, email, password);
    return res.status(201).json({
      message:
        "Registration successful! Please check your email to activate your account.",
      user: userData.user,
    });
  } catch (error) {
    next(error);
  }
};

const activate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activationLink = req.params.link as string;
    await authService.activate(activationLink);
     return res.redirect("http://localhost:5173/activate-success");
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw ErrorHandler.BadRequestError(
      "LOGIN ERROR: Email and password are required!"
    );
  }
  try {
    const userData = await authService.login(email, password);
    res.cookie("refreshToken", userData.refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return res.status(200).json({
      message: "User logged in successfully!",
      userData,
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await authService.logout(refreshToken);
    res.clearCookie("refreshToken").status(200).json({
      message: "User logged out successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};
const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const userData = await authService.refresh(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return res.status(200).json({
      message: "Token refreshed successfully",
      userData,
    });
  } catch (error) {
    next(error);
  }
};


export { registration, activate, login, logout, refresh};