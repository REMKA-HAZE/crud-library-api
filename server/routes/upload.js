const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const path = require('path'); //
const fs = require('fs');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:ruta/:id', (req, res) => {
    let id = req.params.id;
    let ruta = req.params.ruta;
    let archivo = req.files.archivo;
    //archivo unico y guardarlo con extension del archivo.name
    let nombre = uniqid() + path.extname(archivo.name);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    let validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    if (!validExtensions.includes(archivo.mimetype)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'solo las extensiones <pnj, jpg, gif, jpeg> son validas'
            }
        });
    }
    archivo.mv(`uploads/${ruta}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    });
    switch (ruta) {
        case 'producto':
            imagenProducto(id, res, nombre);

            break;

        case 'usuario':
            imagenUsuario(id, res, nombre);

            break;

        default:
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ruta no valida'
                }
            })
            break;
    }
});

//RETORNA AL USUARIO CON ID
//ayuda a actualizar el nombre de la imagen en la bd //valida que la consulta este bien echa
function imagenUsuario(id, res, nombreImagen) {
    Usuario.findById(id, (err, usr) => {
        if (err) {
            borrarArchivo(nombreImagen, 'usuario');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //validar la respuesta
        if (!usr) {
            borrarArchivo(nombreImagen, 'usuario');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        usr.img = nombreImagen;

        //Usuario.findByIdAndUpdate
        usr.save((err, usrDB) => {

            if (err) {
                borrarArchivo(nombreImagen, 'usuario');
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
}

function imagenProducto(id, res, nombreImagen) {
    Producto.findById(id, (err, prd) => {
        if (err) {
            borrarArchivo(nombreImagen, 'producto');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //validar la respuesta
        if (!prd) {
            borrarArchivo(nombreImagen, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }
        prd.img = nombreImagen;

        //Producto.findByIdAndUpdate
        prd.save((err, prdDB) => {
            if (err) {
                borrarArchivo(nombreImagen, 'producto');
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                prdDB
            });
        });
    });
}

function borrarArchivo(nombreImagen, ruta) {
    let pathImg = path.resolve(__dirname, `../../uploads/${ruta},${nombreImagen}`); //cuando hablamos de path hablamos de rutas
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
    console.log('imagen borrada con exito');
}
module.exports = app;