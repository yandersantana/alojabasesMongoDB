const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParametrizacionesSucursalesSchema = new Schema({
    id: { type: Number, required: false},
    sucursal: { type: String, required: false},
    ruc: { type: String, required: false},
    razon_social: { type: String, required: false},
    sri: { type: String, required: false},
    nombre: { type: String, required: false},
    fecha: { type: String, required: false},
    contactoPrincipal: { type: String, required: false},
    celularPrincipal: { type: String, required: false},
    inicio: { type: Number, required: false},
    fin: { type: Number, required: false},
    direccion: { type: String, required: false},
    telefonos: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ParametrizacionesSuc', ParametrizacionesSucursalesSchema);
