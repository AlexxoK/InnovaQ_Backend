import Usuario from '../usuarios/usuario.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {

    const { correo, password } = req.body;

    try {

        const lowerCorreo = correo ? correo.toLowerCase() : null;

        const usuario = await Usuario.findOne({
            $or: [{ correo: lowerCorreo }]
        });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - el correo no existe en la base de datos!'
            });
        }

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos o está desactivado!'
            });
        }

        const validPassword = await verify(usuario.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta!'
            });
        }

        const token = await generarJWT(usuario.id);

        return res.status(200).json({
            msg: 'Login OK!',
            userDetails: {
                correo: usuario.correo,
                token: token,
                role: usuario.role,
                name: usuario.nombre
            }
        })

    } catch (e) {

        console.log(e);

        return res.status(500).json({
            message: "Error en el server!",
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const usuario = await Usuario.create({
            nombre: data.nombre,
            apellido: data.apellido,
            username: data.username,
            correo: data.correo,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role
        })


        return res.status(201).json({
            message: "El usuario se registró satisfactoriamente!",
            userDetails: {
                username: usuario.username,
                correo: usuario.correo
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error registrando el usuario!",
            error: error.message
        })

    }
}