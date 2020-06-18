const mongoose = require('mongoose');
const { Schema } = mongoose;


const detallePagoSchema = new Schema({
    id: { type: Number, required: false},
    idPago: { type: Number, required: false},
    n_cheque: { type: String, required: false},
    nombre_banco: { type: String, required: false},
    fact_proveedor: { type: String, required: false},
    beneficiario: { type: String, required: false},
    orden_compra: { type: Number, required: false},
    fecha_vencimiento: { type: String, required: false},
    valor: { type: Number, required: false},
    no_conformidad: { type: Number, required: false},
    total: { type: Number, required: false},
    id_factura: { type: Number, required: false},
    observaciones: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('DetallePago', detallePagoSchema);