import Pedidos from "../pedidos/pedido.model.js";
import Productos from "../productos/producto.model.js";
import dayjs from "dayjs";

export const existePedidoById = async (id = '') => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }

    const existePedido = await Pedidos.findById(id);

    if (!existePedido) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }
}

export const estadoPedido = async (pedido) => {
    if (!pedido.estado) {
        throw new Error(`El pedido no esta disponible`);
    }
}

export const validarProductosYTotal = async (data) => {

    const productos = [];
    let total = 0;

    for (let item of data.productos) {
        const producto = await Productos.findOne({ nombre: item.producto.toLowerCase() });

        if (!producto.estado) {
            throw new Error(`El producto "${item.producto}" no está disponible`);
        }

        if (!producto) {
            throw new Error(`El producto "${item.producto}" no se ha encontrado`);
        }

        if (producto.stock < item.cantidad) {
            throw new Error(`No hay suficiente cantidad para el producto "${item.producto}". Solo hay ${producto.stock} disponibles`);
        }

        total += producto.precio * item.cantidad;

        productos.push({
            producto: producto._id,
            cantidad: item.cantidad
        });
    }

    data.productos = productos;
    data.total = total;

    for (let item of data.productos) {
        const producto = await Productos.findById(item.producto);
        producto.stock -= item.cantidad;
        if (producto.stock <= 3) {
            producto.estado = false
        }
        await producto.save();
    }
}

export const soloCliente = async (req) => {
    if (req.usuario.role !== "CLIENTE") {
        throw new Error("Solo los CLIENTES pueden hacer pedidos");
    }
}

export const permisoPedido = async (req, pedido) => {
    if (req.usuario._id.toString() !== pedido.usuario.toString() && req.usuario.role !== "ADMIN") {
        throw new Error("No tiene permiso para actualizar o eliminar un pedido que no es tuyo");
    }
}

export const validarTiempoEliminar = async (pedido) => {
    const now = dayjs();
    const pedidoCreatedTime = dayjs(pedido.createdAt);

    const minutesPassed = now.diff(pedidoCreatedTime, 'minute');

    const tiempoLimiteMinutos = 60;

    if (minutesPassed > tiempoLimiteMinutos) {
        throw new Error(`No se puede cancelar el pedido. Ha pasado el límite de ${tiempoLimiteMinutos} minutos desde su creación`);
    }
}