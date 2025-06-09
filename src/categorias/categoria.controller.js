import { response, request } from "express";
import Categoria from "./categoria.model.js";

export const postCategoria = async (req, res) => {
    try {
        const data = req.body;

        const categoria = new Categoria(data);

        await categoria.save();

        res.status(200).json({
            success: true,
            message: 'La categoría fue guardada satisfactoriamente!',
            categoria
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error guardando la categoría!',
            error
        })
    }
}

export const getCategorias = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            categorias
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error encontrando las categorías!',
            error
        })
    }
}

export const getCategoriaPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;

        const categoria = await Categoria.findOne({ nombre });

        if (!categoria) {
            return res.status(404).json({
                success: false,
                msg: 'La categoría no fue encontrada!'
            });
        }

        res.status(200).json({
            success: true,
            categoria
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error encontrando la categoría!',
            error: error.message
        });
    }
};

export const putCategoria = async (req, res = response) => {
    try {

        const { id } = req.params;
        const data = req.body;

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'La categoría fue actualizada!',
            categoria
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error actualizando la categoría!',
            error
        })
    }
}

export const deleteCategoria = async (req, res) => {
    try {

        const { id } = req.params;

        const categoria = await Categoria.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Se desactivó la categoría!',
            categoria,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error desactivando la categoría!',
            error
        })
    }
}