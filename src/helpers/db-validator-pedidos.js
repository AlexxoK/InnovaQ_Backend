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

        const stockRestante = producto.stock - item.cantidad;
        const stockMuestra = producto.stock - 3;

        if (stockRestante < 3) {
            throw new Error(`No hay suficiente cantidad para el producto "${item.producto}". Solo hay ${stockMuestra} disponibles`);
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
    if (req.usuario._id.toString() !== pedido.user.toString() && req.usuario.role !== "ADMIN") {
        throw new Error("No tiene permiso para editar o cancelar un pedido que no es tuyo");
    }
}

export const validarTiempo = async (pedido) => {
    const now = dayjs();
    const pedidoCreatedTime = dayjs(pedido.createdAt);

    const minutesPassed = now.diff(pedidoCreatedTime, 'minute');

    const tiempoLimiteMinutos = 60;

    if (minutesPassed > tiempoLimiteMinutos) {
        throw new Error(`No se puede cancelar o editar el pedido. Ha pasado el límite de ${tiempoLimiteMinutos} minutos desde su creación`);
    }
}

export const actualizarPedido = async (id, { direccion, productos }) => {
    const pedido = await Pedidos.findById(id);
    const updateData = {};

    if (direccion) {
        updateData.direccion = direccion;
    }

    let nuevoTotal = 0;
    const productosAActualizar = [];

    for (let item of productos) {
        const producto = await Productos.findOne({ nombre: item.producto.toLowerCase() });

        if (!producto) {
            throw new Error(`El producto "${item.producto}" no se ha encontrado`);
        }

        const productoPedido = pedido.productos.find(p => p.producto.toString() === producto._id.toString());

        if (productoPedido && productoPedido.cantidad !== item.cantidad) {
            const stockRestante = producto.stock + productoPedido.cantidad - item.cantidad;
            const stockMuestra = producto.stock - 3;

            if (stockRestante < 3) {
                throw new Error(`No hay suficiente cantidad para el producto "${producto.nombre}". Solo hay ${stockMuestra} disponibles`);
            }

            productosAActualizar.push({
                producto: producto,
                cantidad: item.cantidad,
                productoPedido: productoPedido
            });
        } else if (!productoPedido) {
            productosAActualizar.push({
                producto: producto,
                cantidad: item.cantidad
            });
        }
    }

    for (let item of productosAActualizar) {
        const producto = item.producto;
        const cantidad = item.cantidad;
        const productoPedido = item.productoPedido;

        if (productoPedido) {
            producto.stock += productoPedido.cantidad - cantidad;
            productoPedido.cantidad = cantidad;

            if (producto.stock <= 3) {
                producto.estado = false;
            } else {
                producto.estado = true;
            }

            await producto.save();
        } else {
            pedido.productos.push({
                producto: producto._id,
                cantidad: cantidad
            });
            producto.stock -= cantidad;
            await producto.save();
        }

        nuevoTotal += producto.precio * cantidad;
    }

    updateData.total = nuevoTotal;
    updateData.productos = pedido.productos;

    const updatedPedido = await Pedidos.findByIdAndUpdate(id, updateData, { new: true });
    return updatedPedido;
}

export const validarStockPedido = async (pedidoDetails) => {
    for (const item of pedidoDetails.productos) {

        item.producto.stock += item.cantidad;

        if (item.producto.stock > 3) {
            item.producto.estado = true;
        }

        await item.producto.save();
    }
}

export const validarPermisos = async (req) => {
    const usuario = req.usuario;

    if(usuario.role !== "ADMIN") {
        throw new Error("No tienes permisos para realizar esta accion")
    }
}