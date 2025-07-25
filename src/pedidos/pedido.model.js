import dayjs from 'dayjs';
import { Schema, model } from "mongoose";

const PedidoSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'El usuario es requerido'],
        ref: 'Usuario'
    },
    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            required: [true, 'El producto es requerido'],
            ref: 'Productos'
        },
        cantidad: {
            type: Number,
            required: [true, 'La cantidad del producto es requerida'],
            min: 1
        }
    }],
    direccion: {
        type: String,
        required: [true, 'La dirección es requerida']
    },
    fechaPedido: {
        type: String,
        default: () => dayjs().format("DD-MM-YYYY")
    },
    total: {
        type: Number,
        required: [true, 'El total es requerido']
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model('Pedidos', PedidoSchema);