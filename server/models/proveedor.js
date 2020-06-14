
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProveedorSchema = new Schema({
    id: { type: Number, required: false},
    nombre_proveedor: { type: String, required: false},
    ruc: { type: String, required: false},
    direccion: { type: String, required: false},
    celular: { type: String, required: false},
    contacto: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);


