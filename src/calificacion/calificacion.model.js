import mongoose from 'mongoose';

const calificacionSchema = new mongoose.Schema({
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    destinario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    estrellas: {type: Number, required: true, min: 1, max: 5},
    comentario: {type: String, required: false},
    createdAt: {type: Date, default: Date.now},
})

export default mongoose.model('Calificacion', calificacionSchema);