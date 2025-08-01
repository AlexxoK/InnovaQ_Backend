import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { deletePedido, getPedidoById, getPedidosPorUsuario, getPedidos, savePedido, updatePedido, totalSumaAIngresos } from './pedido.controller.js';

const router = Router();

router.post(
    '/',
    validarJWT,
    savePedido
);

router.get(
    '/',
    getPedidos
);

router.get(
    '/pedidos-usuario',
    validarJWT,
    getPedidosPorUsuario
)

router.get(
    '/total-ingresos',
    validarJWT,
    totalSumaAIngresos
)

router.get(
    '/:id',
    [
        check('id', 'ID invalido').not().isEmpty(),
        validarCampos
    ],
    getPedidoById
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'ID invalido').not().isEmpty(),
        validarCampos
    ],
    updatePedido
);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'ID invalido').not().isEmpty(),
        validarCampos
    ],
    deletePedido
);



export default router;