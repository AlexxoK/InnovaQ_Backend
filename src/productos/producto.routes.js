import { uploadImage } from "../middlewares/multer.js";
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { postProucto, getProductos, updateProducts, deleteProductos, productoMasVendido } from "./producto.controller.js";


const router = Router();

router.post('/agregar', validarJWT, uploadImage, postProucto),
router.get('/lista', getProductos)
router.put('/actualizar/:id', validarJWT, uploadImage, updateProducts);
router.delete('/eliminar/:id', validarJWT, deleteProductos)
router.get('/mas-vendidos', validarJWT, productoMasVendido)
export default router;