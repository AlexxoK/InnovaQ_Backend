import { crearFactura, 
    obtenerFacturaPorId, 
    obtenerFacturaPorUser,
    obtenerFacturas } from "./facturas.controller";

import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt";

const router = Router();

router.post('/', validarJWT, crearFactura);
router.get('/', validarJWT, obtenerFacturas);
router.get('/user', validarJWT, obtenerFacturaPorUser);
router.get('/:id', validarJWT, obtenerFacturaPorId);
export default router;