import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  editUserById,
  deleteUserById,
  getUserById,
} from "../controllers/auth.controller.js";
import { body, param } from "express-validator";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email", "Formato de email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),

    body("password", "Formato de Contraseña incorrecto").custom(
      (value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        return value;
      }
    ),
  ],
  validationResultExpress,
  register
);

router.post(
  "/login",
  [
    body("email", "Formato de email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  ],
  validationResultExpress,
  login
);

router.get("/protected", requireToken, getUserById);
router.get("/refresh", refreshToken);
router.get("/logout", logout);

// Nuevas rutas para editar, eliminar y obtener información de usuario por ID
router.put("/edituser/:id", editUserById);
router.delete("/deleteuser/:id", deleteUserById);
router.get("/getuser/:id", getUserById);

export default router;
