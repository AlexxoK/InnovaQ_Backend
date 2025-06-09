import Categoria from '../categorias/categoria.model.js';

export const idCategoriaValida = async (id = ' ') => {
    const categoriaExistente = await Categoria.findOne({ id });

    if (!categoriaExistente) {
        throw new Error(`Categoria ${id} no existe en la base de datos!`);
    }
}

export const nombreCategoriaValido = async (nombre = ' ') => {
    const categoriaExistente = await Categoria.findOne({ nombre });

    if (!categoriaExistente) {
        throw new Error(`Categoria ${nombre} no existe en la base de datos!`);
    }
}