import Factura from "./facturas.model.js";
import { validatePedidoForFactura } from "../helpers/db-validator-facturas.js";

export const crearFactura = async (req, res) => {
    try {
        const { pedido } = req.body;

        const pedidoData = await validatePedidoForFactura(pedido);
        
        const nuevaFactura = new Factura({
            pedido: pedidoData._id,
            user: req.usuario._id,
            productos: pedidoData.productos,
            total: pedidoData.total,
            estado: true
        });
        await nuevaFactura.save();
        res.status(201).json(nuevaFactura);

    } catch (error) {
        res.status(500).json({ error: 'Error al crear la factura', message: error.message });
    }
}

export const obtenerFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find().populate('pedido user', 'nombre apellido correo').populate('productos.producto', 'nombre precio');
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las facturas', message: error.message });
    }
}
export const obtenerFacturaPorUser = async (req, res) => {
    try {
        const  userId  = req.usuario._id;
        console.log(userId);
        const facturas = await Factura.find({ user: userId }).populate('pedido user', 'nombre apellido correo').populate('productos.producto', 'nombre precio');
        if (facturas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron facturas para este usuario' });
        }
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las facturas del usuario', message: error.message});
    }
}
export const obtenerFacturaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const factura = await Factura.findById(id).populate('pedido user', 'nombre apellido correo').populate('productos.producto', 'nombre precio');
        if (!factura) { 
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.status(200).json(factura);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la factura', message: error.message });
    }
}