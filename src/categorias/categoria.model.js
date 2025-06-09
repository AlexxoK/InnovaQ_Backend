import { Schema, model } from "mongoose";

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es requerido!"],
        maxLength: 300,
        lowercase: true
    },

    descripcion: {
        type: String,
        required: [true, "La descripcion es requerida!"],
        maxLength: 5000,
    },

    status: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
    versionKey: false
});

export default model('Categoria', CategoriaSchema);