export const validarPermisos = async (req) => {
    const usuario = req.usuario;

    if(usuario.role !== "ADMIN") {
        throw new Error("No tienes permisos para realizar esta accion")
    }
}