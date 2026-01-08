import { body } from "express-validator";
import { validate } from "../../middlewares/validation.middleware.js";

export const loginValidator = [
  body("email")
    .isString()
    .isEmail()
    .withMessage("Ungültiges E-Mail-Format")
    .normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[?!])[0-9a-zA-Z?!]{8,}$/)
    .withMessage("Passwort muss mindestens 8 Zeichen lang sein"),
  validate,
];
