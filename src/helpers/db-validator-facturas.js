import Pedidos from "../pedidos/pedido.model.js";

export const getPedido = async (idPedido) => {
    const pedido = await Pedidos.findById(idPedido).populate('productos.producto', 'nombre precio stock estado');
    if (!pedido) {
        throw new Error('Pedido no encontrado');
    }
    return pedido; 
}