import Factura from "./facturas.model.js";
import { getPedido } from "../helpers/db-validator-facturas.js";

export const crearFactura = async (req, res) => {
    try {
        const { pedido } = req.body;

        const pedidoData = await getPedido(pedido);
        
        const nuevaFactura = new Factura({
            pedido: pedidoData._id,
            user: req.user._id,
            productos: pedidoData.productos,
            total: pedidoData.total,
            estado: true
        });
        await nuevaFactura.save();
        res.status(201).json(nuevaFactura);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la factura' });
    }
}

export const obtenerFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find().populate('pedido user', 'nombre email').populate('productos.producto', 'nombre precio');
        res.status(200).json(facturas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las facturas' });
    }
}
export const obtenerFacturaPorUser = async (req, res) => {
    try {
        const { userId } = req.user._id;
        const facturas = await Factura.find({ user: userId }).populate('pedido user', 'nombre email').populate('productos.producto', 'nombre precio');
        if (facturas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron facturas para este usuario' });
        }
        res.status(200).json(facturas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las facturas del usuario' });
    }
}
export const obtenerFacturaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const factura = await Factura.findById(id).populate('pedido user', 'nombre email').populate('productos.producto', 'nombre precio');
        if (!factura) { 
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.status(200).json(factura);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la factura' });
    }
}