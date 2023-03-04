const { Schema, model } = require('mongoose');

const empresaSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre de la empresa es obligatorio'],
        unique: true
    },
    tipo: {
        type: String,
        required: [true , 'El tipo de empresa es obligatorio'],
        unique: true
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
    },
    estado: {
        type: Boolean,
        default: true
    },
    sucursales: {
        type: Array,
        default: []
    }
});


module.exports = model('Empresa', empresaSchema);