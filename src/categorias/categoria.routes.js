import { Router } from "express";
import { check } from "express-validator";
import { postCategoria, getCategorias, getCategoriaPorNombre, putCategoria, deleteCategoria } from "./categoria.controller.js";
import { idCategoriaValida, nombreCategoriaValido } from "../helpers/db-validator-categorias.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/postCategoria",
    [
        validarJWT,
        tieneRole("ADMIN"),
        validarCampos
    ],
    postCategoria
)

router.get("/getCategorias", getCategorias);

router.get(
    "/getCategoriaPorNombre/:nombre",
    [
        check("nombre").custom(nombreCategoriaValido),
        validarCampos
    ],
    getCategoriaPorNombre
)

router.put(
    "/putCategoria/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idCategoriaValida),
        validarCampos
    ],
    putCategoria
)

router.delete(
    "/deleteCategoria/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idCategoriaValida),
        validarCampos
    ],
    deleteCategoria
)

export default router;