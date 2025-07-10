import { response, request } from "express";
import { hash } from "argon2";
import Usuario from "./usuario.model.js";



export const getListAuth = async (req, res) => {
    try {
        const usuario = req.usuario

        if(usuario.role != "ADMIN") {
            throw new Error("Solo los administradores pueden ver esta seccion")
        }

        const clientes = await Usuario.find({role : "CLIENTE", estado: true})
        .sort({createdAt: -1}) //orden de creacion del mas reciente al más antiguo
        .limit(5);
        res.status(200).json({
            success: true,
            msg: "Lista de clientes obtenidos correctamente",
            cliente: clientes
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false, 
            msg: "Lista de clientes no obtenidos",
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

export const listarNumeroDeClientes = async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.role !== "ADMIN") {
            throw new Error("Solo los administradores pueden ver esta seccion");
        }

       const cantidadClientes = await Usuario.countDocuments({ role: "CLIENTE", estado: true });
        res.status(200).json({
            success: true,
            msg: "Lista de clientes obtenidos correctamente",
            totalClientes: cantidadClientes,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Lista de clientes no obtenidos",
        });
    }
};