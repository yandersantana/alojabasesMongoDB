const mongoose = require('mongoose');
const { Schema } = mongoose;

const ComprobantePagoSchema = new Schema({
    idDocumento: { type: Number, required: false},
    fecha: { type: Date, required: false},
    documento: { type: String, required: false},
    centroCosto: { type: String, required: false},
    usuario: { type: String, required: false},
    sucursal: { type: String, required: false},
    beneficiario: { type: String, required: false},
    proveedor: { type: String, required: false},
    ruc: { type: String, required: false},
    telefono: { type: String, required: false},
    total: { type: Number, required: false},
    observaciones: { type: String, required: false},
    operacionesComercialesList: { type: Array, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('ComprobantePago', ComprobantePagoSchema);