import Pedidos from './pedido.model.js';
import Usuario from '../usuarios/usuario.model.js';
import { request, response } from 'express';
import { estadoPedido, existePedidoById, permisoPedido, soloCliente, validarProductosYTotal, validarTiempoEliminar } from '../helpers/db-validator-pedidos.js';

export const savePedido = async (req, res) => {
    try {

        const data = req.body;
        const userId = req.usuario._id;
        const user = await Usuario.findById(userId);

        await soloCliente(req)
        await validarProductosYTotal(data);

        const pedido = await Pedidos.create({
            ...data,
            user: user._id,
            username: user.username
        });

        const pedidoDetails = await Pedidos.findById(pedido._id)
            .populate('user', 'nombre apellido username')
            .populate('productos.producto', 'nombre categoria instrucciones imagen precio stock');

        res.status(200).json({
            success: true,
            msg: 'Pedido guardado exitosamente!!',
            pedidoDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al guardar el pedido',
            error: error.message
        });
    }
}

export const getPedidos = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, pedidos] = await Promise.all([
            Pedidos.countDocuments(query),
            Pedidos.find(query)
                .populate('user', 'nombre apellido username')
                .populate('productos.producto', 'nombre categoria instrucciones imagen precio stock')
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ createdAt: -1 })
        ]);

        res.status(200).json({
            success: true,
            total,
            msg: 'Pedidos obtenidos exitosamente!!',
            pedidos
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obetener los pedidos',
            error: error.message
        });
    }
}

export const getPedidoById = async (req, res) => {
    try {

        const { id } = req.params;

        await existePedidoById(id);

        const pedido = await Pedidos.findById(id)
            .populate('user', 'nombre apellido username')
            .populate('productos.producto', 'nombre categoria instrucciones imagen precio stock');

        await estadoPedido(pedido);

        res.status(200).json({
            success: true,
            msg: 'Pedido obtenido exitosamente!!',
            pedido
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener pedido',
            error: error.message
        });
    }
}

export const updatePedido = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { direccion, productos } = req.body;
        const user = req.user._id;

        await existePedidoById(id);

        const pedido = await Pedidos.findById(id);
        await estadoPedido(pedido);

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar pedido',
            error: error.message
        });
    }
}

export const deletePedido = async (req, res = response) => {
    try {
        
        const { id } = req.params;

        await existePedidoById(id);
        
        const pedido = await Pedidos.findById(id);
        await permisoPedido(req, pedido);
        await validarTiempoEliminar(pedido);

        const pedidoDelete = await Pedidos.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Pedido cancelado!!',
            pedidoDelete
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al cancelar su pedido',
            error: error.message
        });
    }
}