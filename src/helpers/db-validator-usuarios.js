import Usuario from '../usuarios/usuario.model.js';

export const idUsuarioValida = async (id = ' ') => {
    const usuarioExistente = await Usuario.findOne({ id });

    if (!usuarioExistente) {
        throw new Error(`Usuario ${id} no existe en la base de datos!`);
    }
}