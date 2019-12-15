const express = require('express');
const _ = require('underscore');
const Lending = require('../models/lending'); //subir nivel
const app = express();

app.post('/lending', (req, res) => {
    let body = req.body;
    let lending = new Lending({
        nombre: body.nombre,
        usuario: body.usuario,
        producto: body.producto,
        prestamo: body.prestamo,
        entrega: body.entrega,
        nbook: body.nbook
    });

    lending.save((err, lenDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            lenDB
        });
    });
});

app.put('/lending/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'nbook', 'prestamo', 'entrega', 'disponible', 'usuario', 'producto']);
    Lending.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, lenDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            lenDB
        });

    });
});

app.get('/lending', (req, res) => {
    Lending.find({ disponible: true })
        .exec((err, lendings) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: lendings.length,
                lendings
            });
        });
});
app.get('/lending/:id', (req, res) => {
    let id = req.params.id;
    Lending.find({ disponible: true, _id: id })
        .exec((err, lendings) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: lendings.length,
                lendings
            });
        });
});

app.delete('/lending/:id', (req, res) => {
    let id = req.params.id;
    Lending.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, resp) => {
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