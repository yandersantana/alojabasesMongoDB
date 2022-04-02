const mongoose = require('mongoose');
const { Schema } = mongoose;

const ComprobantePagoProveedoresSchema = new Schema({
    idDocumento: { type: Number, required: false},
    fechaComprobante: { type: Date, required: false},
    giradoA: { type: String, required: false},
    referencia: { type: String, required: false},
    usuario: { type: String, required: false},
    sucursal: { type: String, required: false},
    nombreProveedor: { type: String, required: false},
    transaccionesFacturas: { type: Array, required: false},
    transaccionesCheques: { type: Array, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('ComprobantePagoProveedores', ComprobantePagoProveedoresSchema);