import Role from '../roles/role.model.js';
import Usuario from '../usuarios/usuario.model.js';

export const roleExistente = async (role = ' ') => {
    const roleExistente = await Role.findOne({ role });

    if (!roleExistente) {
        throw new Error(`El role ${role} no existe en la base de datos!`);
    }
}

export const correoExistente = async (correo = ' ') => {
    const correoExistente = await Usuario.findOne({ correo });

    if (correoExistente) {
        throw new Error(`El correo ${correo} no existe en la base de datos!`);
    }
}