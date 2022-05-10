const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransaccionesFacturasSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: Date, required: false},
    idFactura: { type: String, required: false},
    idComprobante: { type: String, required: false},
    numFactura: { type: Number, required: false},
    fechaFactura: { type: Date, required: false},
    valorFactura: { type: Number, required: false},
    valorCancelado: { type: Number, required: false},
    valorAbonado: { type: Number, required: false},
    valorSaldos: { type: Number, required: false},
    numCheque: { type: String, required: false},
    banco: { type: String, required: false},
    cuenta: { type: String, required: false},
    tipoPago: { type: String, required: false},
    cuenta:{ type: String, required: false},
    fechaPago: { type: String, required: false},
    proveedor: { type: String, required: false},
    usuario: { type: String, required: false},
    estado: { type: String, required: false},
    estadoOrden: { type: String, required: false},
    numeroOrden: { type: Number, required: false},
    observaciones: { type: String, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('TransaccionesFacturas', TransaccionesFacturasSchema);


