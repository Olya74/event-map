import { body } from "express-validator";
import { validate } from "../../middlewares/validation.middleware.js";

export const registerValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Non-valid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/)
    // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[?!])[0-9a-zA-Z?!]{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (? or !)"
    ),

  body("name")
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 30 })
    .withMessage(
      "Username must be at least 2 characters long and max 30 characters long"
    ),

  validate,
];
