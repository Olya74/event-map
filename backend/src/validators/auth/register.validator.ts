import { body } from "express-validator";
import { validate } from "../../middlewares/validation.middleware.js";

export const registerValidator = [
  body("email")
    .trim()
    .notEmpty()
     .withMessage("Email is required")
    .isEmail()
    .withMessage("Non-valid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (? or !)"
    ),

  body("name")
    .trim()
    .notEmpty()
    .isAlpha().withMessage('Имя должно содержать только буквы')
    .isLength({ min: 2, max: 30 })
    .withMessage(
      "Username must be at least 2 characters long and max 30 characters long"
    )
    .escape()
    ,

  validate,
];
