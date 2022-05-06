const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransaccionesChequesSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: Date, required: false},
    idComprobante: { type: String, required: false},
    idPago: { type: Number, required: false},
    numCheque: { type: String, required: false},
    banco: { type: String, required: false},
    cuenta: { type: String, required: false},
    fechaPago: { type: String, required: false},
    fechaPagoDate: { type: Date, required: false},
    valor: { type: Number, required: false},
    facturas: { type: String, required: false},
    proveedor: { type: String, required: false},
    usuario: { type: String, required: false},
    estado: { type: String, required: false},
    observaciones: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('TransaccionesCheques', TransaccionesChequesSchema);


