import { Schema, model } from "mongoose";

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es requerido!"],
        maxlenght: [25, "El máximo de carácteres es 25!"],
        lowercase: true
    },

    apellido: {
        type: String,
        required: [true, "El apellido es requerido!"],
        maxlenght: [25, "El máximo de carácteres es 25!"],
        lowercase: true
    },

    username: {
        type: String,
        required: [true, "El username es requerido!"],
        unique: [true, "El username ya existe!"],
        lowercase: true
    },

    correo: {
        type: String,
        required: [true, "El correo es requerido!"],
        unique: [true, "El correo ya existe!"],
        lowercase: true
    },

    password: {
        type: String,
        required: [true, "La contraseña es requerida!"],
        minlength: [8, "8 caracteres mínimos!"],
    },

    phone: {
        type: String,
        required: [true, "El número es requerido!"],
        minlength: [8, "8 carácteres mínimos!"],
        maxlength: [8, "8 carácteres máximos!"]
    },

    role: {
        type: String,
        required: [true, "El role es requerido!"],
        enum: ["ADMIN", "CLIENTE"],
        default: "CLIENTE"
    },
    ingresos: {
        type: Number,
        default: 0
    },

    estado: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionkey: false
    }
);

UsuarioSchema.methods.toJSON = function () {
    const { _v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('Usuario', UsuarioSchema);