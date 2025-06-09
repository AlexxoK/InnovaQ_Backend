import { Router } from "express";
import { check } from "express-validator";
import { getUsuarios, getUsuarioPorId, putUsuario, putPassword, deleteUsuario } from "./usuario.controller.js";
import { idUsuarioValida } from "../helpers/db-validator-usuarios.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/getUsuarios", getUsuarios);

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
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idUsuarioValida),
        validarCampos
    ],
    putUsuario
)

router.put(
    "/putPassword/:id",
    [
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idUsuarioValida),
        validarCampos
    ],
    putPassword
)

router.delete(
    "/deleteUsuario/:id",
    [
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idUsuarioValida),
        validarCampos
    ],
    deleteUsuario
)

export default router;