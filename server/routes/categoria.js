const express = require('express');
const _ = require('underscore');
const Categoria = require('../models/categoria');
const app = express();

app.post('/categoria', (req, res) => {
    let body = req.body;
    let categoria = new Categoria({

        producto: body.producto,
        usuario: body.usuario,
        sta: body.sta,
        entrega: body.entrega
    });

    categoria.save((err, catDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            catDB
        });
    });
});

app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['producto', 'usuario', 'sta', 'entrega', 'disponible']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, catDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            catDB
        });

    });
});

app.get('/categoria', (req, res) => {
    Categoria.find({ disponible: true })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: categorias.length,
                categorias
            });
        });
});
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.find({ disponible: true, _id: id })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: categorias.length,
                categorias
            });
        });
});

app.delete('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, { sta: false }, { new: true, runValidators: true, context: 'query' }, (err, resp) => {
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