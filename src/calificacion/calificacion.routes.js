import express from 'express';
import {crearCalificacion, getCalificaciones, getPromedioCalificacion} from './calificacion.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = express.Router();

router.post('/:id', validarJWT, crearCalificacion);
router.get('/', validarJWT, getCalificaciones);
router.get('/promedio', validarJWT, getPromedioCalificacion);

export default router;