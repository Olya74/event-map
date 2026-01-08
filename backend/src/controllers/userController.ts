import { Request, Response, NextFunction } from "express";
import userService from "../services/user-service.js";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const createAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file || !req.body.userId) {
      return res.status(400).json({ message: "File and user are required" });
    }
    const avatar = await userService.createAvatar(
      req.file,
      req.body.userId,
      "user_avatars"
    );
    res.status(201).json(avatar);
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  try {
    const user = await userService.getUserById(userId!);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { from, to, subject, text } = req.body;
  try {
    const result = await userService.sendEmail(from, to, subject, text);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export { getUsers, createAvatar, getUserById, sendEmail };