import { Router } from "express";
import { check } from "express-validator";
import { getListAuth, getUsuarioPorId, putUsuario, deleteUsuario, listarNumeroDeClientes } from "./usuario.controller.js";
import { idUsuarioValida } from "../helpers/db-validator-usuarios.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/getUsuarios", validarJWT, getListAuth);
router.get("/numeroClientes", validarJWT, listarNumeroDeClientes);

router.get(
    "/getUsuarioPorId/:id",
    [
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idUsuarioValida),
        validarCampos
    ],
    getUsuarioPorId
)

router.put(
    "/putUsuario/:id",
    [
        validarJWT,
        tieneRole("CLIENTE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idUsuarioValida),
        validarCampos
    ],
    putUsuario
)

router.delete(
    "/deleteUsuario/:id",
    [
        validarJWT,
        tieneRole("CLIENTE", "ADMIN"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idUsuarioValida),
        validarCampos
    ],
    deleteUsuario
)

export default router;