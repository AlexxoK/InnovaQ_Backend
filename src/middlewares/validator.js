import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { correoExistente, roleExistente } from "../helpers/db-validator-roles.js";

export const registerValidator = [
    body("nombre", "El nombre es requerido!").not().isEmpty(),
    body("apellido", "El apellido es requerido!").not().isEmpty(),
    body("username", "El username es requerido!").not().isEmpty(),
    body("correo", "Debes ingresar un correo válido!").isEmail(),
    body("correo").custom(correoExistente),
    body("password", "La contraseña debe tener entre 8 y 15 caracteres!")
        .isLength({ min: 8, max: 15 }),
    body("phone", "El número es requerido!").not().isEmpty(),
    body("role").custom(roleExistente),
    validarCampos
]

export const loginValidator = [
    body("correo").optional().isEmail().withMessage("Ingrese un correo válido!"),
    body("password", "La contraseña debe tener mínimo 8 números!").isLength({ min: 8 }),
    validarCampos
]