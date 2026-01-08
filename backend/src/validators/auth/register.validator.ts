import { body } from "express-validator";
import { validate } from "../../middlewares/validation.middleware.js";

export const registerValidator = [
  body("email")
    .trim()
    .notEmpty()
    .escape()
    .isEmail()
    .withMessage("Ungültiges E-Mail-Format")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[?!])[0-9a-zA-Z?!]{8,}$/)
    .withMessage("Passwort muss mindestens 8 Zeichen lang sein"),

  body("username")
    .isString()
    .isLength({ min: 2, max: 30 })
    .withMessage("Benutzername muss mindestens 2 Zeichen lang sein"),
  validate,
];
