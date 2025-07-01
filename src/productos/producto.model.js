import mongoose, {Schema}from "mongoose"; 

const ProductosSchema = Schema({
    nombre: {unique: true, type: String, required: "El nombre es obligatorio", lowercase: true},
    categoria : {type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: ["La categoria es obligatoria"]},
    instrucciones : {type: String, required: ["Las instrucciones son obligatorias"]},
    imagen : {type: String},
    precio: {type: Number, required: ["El precio es obligatorio"]},
    stock : {type: Number, required: ["El stock es obligatorio"]},
    status : {type: Boolean,},
}, {timestamps: true});

export default mongoose.model("Productos", ProductosSchema);