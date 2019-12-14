const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Usuario = require('./usuario');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,

    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'Por favor ingresa el nombre del producto']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Por favor ingresa el nombre del usuario']
    },
    sta: {
        type: Date,
        default: Date.now
    },
    entrega: {
        type: Date

    }
});

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});

//crea una coleccion
module.exports = mongoose.model('Categoria', categoriaSchema);