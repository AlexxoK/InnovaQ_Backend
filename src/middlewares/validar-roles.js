export const tieneRole = (...roles) => {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'Quieres verificar el rol sin validar el token primero!'
            })
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                success: false,
                msg: `Usuario no autorizado, tiene el rol ${req.usuario.role}, los roles autorizados son: ${roles}`
            })
        }

        next();
    }
}