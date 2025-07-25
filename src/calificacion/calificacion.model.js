import mongoose from 'mongoose';

const calificacionSchema = new mongoose.Schema({
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    destinario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    estrellas: {type: Number,},
    comentario: {type: String, },
    createdAt: {type: Date, default: Date.now},
})

export default mongoose.model('Calificacion', calificacionSchema);