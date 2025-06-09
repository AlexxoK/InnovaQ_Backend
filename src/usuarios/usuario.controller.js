import { response, request } from "express";
import { hash } from "argon2";
import Usuario from "./usuario.model.js";

export const getUsuarios = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            usuarios
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error encontrando los usuarios!',
            error
        })
    }
}

export const getUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findById(id);

        res.status(200).json({
            success: true,
            usuario
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error encontrando el usuario!',
            error
        })
    }
}

export const putUsuario = async (req, res = response) => {
    try {
        const { id } = req.params;
        const usuarioAuth = req.usuario;

        if (id !== usuarioAuth.id) {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para actualizar este usuario!'
            });
        }

        const { password, ...data } = req.body;

        if (password) {
            data.password = await hash(password);
        }

        const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'El usuario fue actualizado!',
            usuario
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error actualizando el usuario!',
            error
        });
    }
}

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const dUsuario = req.usuario;

        if (id !== dUsuario.id && dUsuario.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para desactivar este usuario!'
            });
        }

        const usuario = await Usuario.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        )

        res.status(200).json({
            success: true,
            msg: 'Se desactivó el usuario!',
            usuario,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error desactivando el usuario!',
            error,
        })
    }
}