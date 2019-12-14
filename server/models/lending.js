const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Usuario = require('./usuario');
const Producto = require('./producto');
let Schema = mongoose.Schema;

let lendingSchema = new Schema({
    nombre: {
        type: String,
        unique: true,

    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        // required: [true, 'Por favor ingresa la categoria del producto']
    },
    disponible: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        // required: [true, 'Por favor ingresa el nombre del usuario']
    },

});

lendingSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});

//crea una coleccion
module.exports = mongoose.model('Lending', lendingSchema);