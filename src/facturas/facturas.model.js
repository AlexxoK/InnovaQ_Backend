import dayjs from 'dayjs'
import {Schema, model} from 'mongoose'

const FacturaSchema = Schema({
    pedido:{
        type: Schema.Types.ObjectId,
        required: [true, 'El pedido es requerido'],
        ref: 'Pedidos'
    },
    user:{
        type: Schema.Types.ObjectId,
        required: [true, 'El usuario es requerido'],
        ref: 'Usuario'
    },
    productos:[{
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
    fechaEmitida: {
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
},
{
    timestamps: true,
    versionKey: false
})

export default model('Facturas', FacturaSchema);