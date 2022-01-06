const mongoose = require('mongoose');
const { Schema } = mongoose;

const CuentaPorCobrarSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: Date, required: false},
    sucursal: { type: String, required: false},
    cliente: { type: String, required: false},
    rucCliente: { type: String, required: false},
    rCajaId: { type: String, required: false},
    documentoVenta: { type: String, required: false},
    numDocumento: { type: String, required: false},
    valor: { type: Number, required: false},
    tipoPago: { type: String, required: false},
    estado: { type: String, required: false},
    notas: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('CuentaPorCobrar', CuentaPorCobrarSchema);
