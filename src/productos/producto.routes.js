import uploadFile from "../middlewares/multer.js";
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { postProucto, getProductos } from "./producto.controller.js";


const router = Router();

router.post('/agregar', validarJWT, uploadFile, postProucto)
router.post('/lista', getProductos, validarJWT)
export default router;