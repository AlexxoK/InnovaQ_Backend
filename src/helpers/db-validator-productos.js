import categoriaModel from "../categorias/categoria.model.js";
import productoModel from "../productos/producto.model.js";




export const validarPermisos = async (req) => {
    const usuario = req.usuario;

    if(usuario.role !== "ADMIN") {
        throw new Error("No tienes permisos para realizar esta accion")
    }
}

export const validarExistenciaProducto = async (id = '') => {
    const producto = await productoModel.findById(id)

    if(!producto) {
        throw new Error("Producto no encontrado")
    }
}

export const validarExistenciaCategoria = async (id = '') => {
    const categoria = await categoriaModel.findById(id)

    if(!categoria) {
        throw new Error("Categoria no encontrada")
    }
}