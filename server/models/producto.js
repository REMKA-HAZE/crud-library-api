const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Usuario = require('./usuario');
const Categoria = require('./categoria');

let Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: {
        type: String,
        //  unique: true,
        required: [true, 'Por favor ingresa el nombre del libro']
    },
    editorial: {
        type: String,
        //  unique: true,
        required: [true, 'Por favor ingresa el nombre del editorial']
    },
    autor: {
        type: String,
        //  unique: true,
        required: [true, 'Por favor ingresa el nombre del autor']
    },
    precioUni: {
        type: Number,
        required: [true, 'Por favor ingresa el precio del producto']
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
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
    img: {
        type: String,
        // required: [true, 'Por favor ingresa la imagen']
    }
});

productoSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});

//crea una coleccion
module.exports = mongoose.model('Producto', productoSchema);