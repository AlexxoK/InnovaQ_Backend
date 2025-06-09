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
        const { _id, password, email, ...data } = req.body;

        if (password) {
            data.password = await hash(password)
        }

        const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'El usuario fue actualizado!',
            usuario
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error actualizando el usuario!',
            error
        })
    }
}

export const putPassword = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { password } = req.body;

        if (password) {
            data.password = await hash(password)
        }

        const usuario = await Usuario.findByIdAndUpdate(id, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Password update!',
            usuario
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error update!',
            error
        })
    }
}

export const deleteUsuario = async (req, res) => {
    try {

        const { id } = req.params;

        const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Se desactivo el usuario!',
            usuario,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error desactivando el usuario!',
            error
        })
    }
}