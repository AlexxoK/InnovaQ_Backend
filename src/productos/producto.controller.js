import categoriaModel from "../categorias/categoria.model.js";
import productoModel from "./producto.model.js";
import { validarPermisos, validarExistenciaProducto, validarExistenciaCategoria } from "../helpers/db-validator-productos.js";


export const postProucto = async (req, res) => {
    try {
        const data = req.body;
        const categoria = await categoriaModel.findOne({ nombre: data.categoria });
        const user = req.usuario;

        await validarPermisos(req);

        let imagen = "";
        if (req.file) {
            imagen = req.file.filename;
        } else if (data.imagen && data.imagen.startsWith("http")) {
            imagen = data.imagen;
        } else {
            return res.status(400).json({ msg: "No se subió imagen ni se proporcionó una URL válida" });
        }
        const newProduct = await productoModel.create({
            ...data,
            categoria: categoria,
            imagen: imagen,
            estado: true,

        })
        await newProduct.save();

        const productoGuardado = await productoModel.findById(newProduct._id).populate("categoria", "nombre")

        res.status(200).json({
            success: true,
            msg: "Producto guardado",
            producto: productoGuardado,
            role: user,
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
        const productos = await productoModel.find({ estado: true }).populate("categoria", "nombre")
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

export const updateProducts = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const usuario = req.usuario;
        await validarPermisos(req);
        await validarExistenciaProducto(id)

        let imagen = "";
        const updateData = { ...data, };

        if (data.categoria) {
            const categoria = await categoriaModel.findOne({ nombre: data.categoria });

            if (!categoria) {
                return res.status(400).json({ msg: "Categoría no encontrada" });
            }

            updateData.categoria = categoria._id;
        }
        if (req.file) {
            updateData.imagen = req.file.filename;
        } else if (data.imagen && data.imagen.startsWith("http")) {
            updateData.imagen = data.imagen;
        }

        const productoActualizado = await productoModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate("categoria", "nombre");

        res.status(200).json({
            success: true,
            message: "Producto Actualizado",
            producto: productoActualizado
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const deleteProductos = async (req, res) => {
    const id = req.params.id;

    try {
        const producto = await productoModel.findById(id);
        await validarPermisos(req);
        await validarExistenciaProducto(id);

        const productoDelete = await productoModel.findByIdAndUpdate(id, {estado: false}, { new: true });

        res.status(200).json({
            success: true,
            message: "Producto eliminado",
            productoDelete
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const productoMasVendido = async (req, res) => {
    try {
        const productos = await productoModel.find({ stock: { $lte: 10 } }).sort({ stock: 1 })

        const productosModificados = productos.map(producto => ({
            ...producto.toObject(),
            stock: producto.stock < 0 ? 0 : producto.stock
        }))
        res.status(200).json({
            success: true,
            msg: "Productos mas vendidos obtenidos correctamente",
            productoMasVendido: productosModificados
        })
    } catch(error){
    console.log(error);
    }
}