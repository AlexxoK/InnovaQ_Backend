import calificacionModel from "./calificacion.model.js";
import { validarPermisos } from "../helpers/db-validator-calificacion.js";


export const crearCalificacion = async (req, res) => {
    try{
        const {estrellas, comentario} = req.body;
        const usuario = req.usuario;
        const destinario = req.params.id;
        const yaExiste = await calificacionModel.findOne({usuario, destinario});

        

        if(yaExiste){
            return res.status(400).json({error: 'Ya calificaste ya no puedes calificar otra vez'});
        }

        const nuevaCalificacion = new calificacionModel({
            usuario,
            destinario,
            estrellas,
            comentario
        })
        await nuevaCalificacion.save();
        res.status(200).json({
            message: 'Calificación creada correctamente',
            calificacion: nuevaCalificacion
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

export const getCalificaciones = async (req, res) => {
    try{
        const usuario = req.usuario

        const calificaciones = await calificacionModel.find({destinario: usuario._id})
        .populate('usuario', 'nombre apellido username')
        .populate('destinario', 'username role')
        .sort({createdAt: -1})
        await validarPermisos(req);


        res.status(200).json({
            message: 'Listado de calificaciones',
            calificaciones: calificaciones
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

export const getPromedioCalificacion = async (req, res) => {
    try{
        const usuario = req.usuario;
        const calificaciones = await calificacionModel.find({destinario: usuario._id})
        const totalEstrellas = calificaciones.reduce((total, calificacion) => total + calificacion.estrellas, 0);
        const promedio = calificaciones.length > 0 ? totalEstrellas / calificaciones.length : 0;

        res.status(200).json({
            message: 'Promedio de calificaciones',
            promedioEstrellas: promedio.toFixed(1)
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}