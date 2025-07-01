import categoriaModel from "../categorias/categoria.model.js";
import productoModel from "./producto.model.js";
import { imagenUploaden } from "../helpers/db-validator-productos.js";


export const postProucto = async (req, res) => {
    try {
        const data = req.body;
        const categoria = await categoriaModel.findOne({ nombre: data.categoria });
        const imagen = req.file?.imagen;
        const user = req.user;

        

        const newProduct = await productoModel.create({
            ...data,
            categoria: categoria,
            imagen: imagen
        })
        await newProduct.save();

        const productoGuardado = await productoModel.findById(newProduct._id).populate("categoria", "nombre")

        res.status(200).json({
            success: true,
            msg: "Producto guardado",
            producto: productoGuardado,
            role: user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message,
            success: false
        })
    }

}

export const getProductos = async (req, res) => {
    try {
        const productos = await productoModel.find({ status: true }).populate("categoria", "nombre")
        res.status(200).json({
            msg: "Productos obtenidos",
            productos
        })
    } catch (error) {
        res.status(500).json({
            msg: "Hubo un error al obtener la lista de Productos",
            error: error.message
        })
    }
}