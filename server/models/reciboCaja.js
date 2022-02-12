const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReciboCajaSchema = new Schema({
    idDocumento: { type: Number, required: false},
    fecha: { type: Date, required: false},
    docVenta: { type: String, required: false},
    cliente: { type: String, required: false},
    ruc: { type: String, required: false},
    sucursal: { type: String, required: false},
    tipoPago: { type: String, required: false},
    numDocumento: { type: String, required: false},
    banco: { type: String, required: false},
    valorFactura: { type: Number, required: false},
    valorRecargo: { type: Number, required: false},
    valorPagoEfectivo: { type: Number, required: false},
    valorOtros: { type: Number, required: false},
    valorSaldos: { type: Number, required: false},
    observaciones: { type: String, required: false},
    estadoRecibo: { type: String, required: false},
    isAutorizado: { type: Boolean, required: false},
    isRechazado: { type: Boolean, required: false},
    operacionesComercialesList: { type: Array, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('ReciboCaja', ReciboCajaSchema);