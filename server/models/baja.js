const mongoose = require('mongoose');
const { Schema } = mongoose;


const BajasSchema = new Schema({
    id: { type: Number, required: false},
    usuario: { type: String, required: false},
    observaciones: { type: String, required: false},
    sucursal: { type: String, required: false},
    fecha: { type: String, required: false},
    fecha_transaccion: { type: String, required: false},
    id_baja: { type: Number, required: false},
    totalBajas: { type: Number, required: false},
    estado: { type: String, required: false},
    productosBaja: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Baja', BajasSchema);