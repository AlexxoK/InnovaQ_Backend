import { crearFactura, 
    obtenerFacturaPorId, 
    obtenerFacturaPorUser,
    obtenerFacturas } from "./facturas.controller.js";

import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {tieneRole} from "../middlewares/validar-roles.js";

const router = Router();

router.post('/', validarJWT, crearFactura);
router.get('/', validarJWT,tieneRole('ADMIN'), obtenerFacturas);
router.get('/user', validarJWT, obtenerFacturaPorUser);
router.get('/:id', validarJWT, obtenerFacturaPorId);
export default router;