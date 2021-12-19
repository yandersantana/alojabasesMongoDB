const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransaccionesFinancierasSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: Date, required: false},
    sucursal: { type: String, required: false},
    cliente: { type: String, required: false},
    rCajaId: { type: String, required: false},
    documentoVenta: { type: String, required: false},
    numDocumento: { type: String, required: false},
    valor: { type: Number, required: false},
    tipoPago: { type: String, required: false},
    cuenta:{ type: String, required: false},
    subCuenta: { type: String, required: false},
    tipoCuenta: { type: String, required: false},
    soporte: { type: String, required: false},
    dias: { type: Number, required: false},
    vencimiento: { type: String, required: false},
    id_documento : { type: Number, required: false},
    tipoTransaccion : { type: String, required: false},
    notas: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('TransaccionesFinancieras', TransaccionesFinancierasSchema);


