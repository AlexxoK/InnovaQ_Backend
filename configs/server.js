'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { hash } from 'argon2';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoriaRoutes from '../src/categorias/categoria.routes.js';
import usuarioRoutes from '../src/usuarios/usuario.routes.js';
import Usuario from '../src/usuarios/usuario.model.js';
import ProductoRoutes from '../src/productos/producto.routes.js';
import CalificacionRoutes from '../src/calificacion/calificacion.routes.js';
import PedidoRoutes from '../src/pedidos/pedido.routes.js';
import FacturaRoutes from '../src/facturas/facturas.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/InnovaQ/v1/auth", authRoutes);
    app.use("/InnovaQ/v1/categorias", categoriaRoutes);
    app.use("/InnovaQ/v1/usuarios", usuarioRoutes);
    app.use("/InnovaQ/v1/productos", ProductoRoutes);
    app.use("/InnovaQ/v1/calificacion", CalificacionRoutes);
    app.use("/InnovaQ/v1/pedidos", PedidoRoutes);
    app.use("/InnovaQ/v1/facturas", FacturaRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Succesful connecting to database!')
    } catch (error) {
        console.log('Error connecting to database!');
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}!`);
    } catch (err) {
        console.log(`Server init failed: ${err}!`);
    }
}

export const createAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ role: "ADMIN" });

        if (!adminExistente) {
            const hashedPassword = await hash("admin027");

            const admin = new Usuario({
                nombre: "Rosa",
                apellido: "Pineda",
                username: "RosaK",
                correo: "rosa@gmail.com",
                ingresos: 0,
                password: hashedPassword,
                phone: "12345678",
                role: "ADMIN",
            });

            await admin.save();
            console.log("Administrador creado con éxito!");
        } else {
            console.log("El administrador ya existe! No se creo nuevamente!");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error.message);
    }
}