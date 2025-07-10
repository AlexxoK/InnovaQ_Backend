import upload from "../middlewares/multer.js";
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { postProucto, getProductos, updateProducts, deleteProductos, productoMasVendido } from "./producto.controller.js";


const router = Router();

router.post('/agregar', validarJWT, upload.single("imagen"), postProucto)
router.get('/lista', getProductos)
router.put('/actualizar/:id', validarJWT, upload.single("imagen"), updateProducts)
router.delete('/eliminar/:id', validarJWT, deleteProductos)
router.get('/mas-vendidos', validarJWT, productoMasVendido)
export default router;