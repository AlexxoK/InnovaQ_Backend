import Pedidos from "../pedidos/pedido.model.js";
import Facturas from "../facturas/facturas.model.js";

export const getPedido = async (idPedido) => {
    const pedido = await Pedidos.findById(idPedido).populate('productos.producto', 'nombre precio stock estado');
    if (!pedido) {
        throw new Error('Pedido no encontrado');
    }
    return pedido; 
}

export const validatePedido = async (idPedido) => {
        const pedido = await getPedido(idPedido);
        if (pedido.estado !== true) {
            throw new Error('El pedido no se encuentra activo');
        }
        return pedido;
};

export const validatePedidoForFactura = async (idPedido) => {
        const pedido = await validatePedido(idPedido);
        if (pedido.productos.length === 0) {
            throw new Error('El pedido no tiene productos para generar factura');
        }
        const facturaDuplicada = await Facturas.findOne({ pedido: idPedido });
        if (facturaDuplicada) {
            throw new Error('Ya existe una factura para este pedido');
        }
        return pedido;
};