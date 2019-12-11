const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');
const Usuario = require('../models/usuario'); //subir nivel
const app = express();

app.get('/usuario/', [verificaToken], (req, res) => {
    // let desde = req.params.desde || 0;
    // desde = Number(desde); //forzar que el dato siempre sea numerico
    // let limite = req.params.limite || 0;
    // limite = Number(limite);

    Usuario.find({ estado: true, }) //select * from usuario where estado=true
        //solo aceptan valores numericos
        // .skip(desde)
        // .limit(limite)
        .exec((err, usuarios) => { //ejecuta la funcion
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            console.log(req.usuario);
            return res.status(200).json({
                ok: true,
                count: usuarios.length,
                usuarios
            });
        });
});
//indicando que de la ruta usuario, se espera una variable
// app.get('/usuario/:id/:nombre', (req, res) => { //req lo usa el cliente res lo que responde el servidor
//     let id = req.params.id;
//     let nombre = req.params.nombre;
//     res.json({
//         id,
//         nombre
//     });
// });
app.get('/usuario/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    Usuario.find({ estado: true, _id: id }) //select * from usuario where estado=true
        .exec((err, usuarios) => { //ejecuta la funcion
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            console.log(req.usuario);
            return res.status(200).json({
                ok: true,
                count: usuarios.length,
                usuarios
            });
        });
});
app.post('/usuario', [verificaToken], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        //para poder mandar los datos a la coleccion
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //numero de veces de encriptar
        img: body.img
    });

    usuario.save((err, usrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            usrDB
        });
    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'estado', 'role', 'img']); //FILTRAR del body, on el pick seleccionar los campos que interesan del body 
    //id 'su coleccion, new -> si no existe lo inserta, runVali-> sirve para validar todas las condiciones del modelo 
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            usrDB
        });

    });
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    //     Usuario.deleteOne({ _id: id }, (err, resp) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         //comprueba si eliminó algo
    //         if (resp.deletedCount === 0) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     id,
    //                     msg: 'Usuario no encontrado'
    //                 }
    //             });
    //         }

    //         return res.status(200).json({
    //             ok: true,
    //             resp
    //         });
    //     });

    //update from - set 
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true, context: 'query' }, (err, resp) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            resp
        });
    });
});

module.exports = app;