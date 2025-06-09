import { Router } from "express";
import { check } from "express-validator";
import { postCategoria, getCategorias, getCategoriaPorNombre, putCategoria, deleteCategoria } from "./categoria.controller.js";
import { idCategoriaValida, nombreCategoriaValido } from "../helpers/db-validator-categorias.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/postCategoria",
    [
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
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idCategoriaValida),
        validarCampos
    ],
    putCategoria
)

router.delete(
    "/deleteCategoria/:id",
    [
        check("id", "id invalid!").isMongoId(),
        check("id").custom(idCategoriaValida),
        validarCampos
    ],
    deleteCategoria
)

export default router;