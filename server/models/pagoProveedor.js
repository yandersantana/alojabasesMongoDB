const mongoose = require('mongoose');
const { Schema } = mongoose;



const PagosProveedorSchema = new Schema({
    id: { type: String, required: false},
    n_cheque: { type: String, required: false},
    fecha_transaccion: { type: String, required: false},
    fecha_factura: { type: String, required: false},
    nombre_banco: { type: String, required: false},
    n_cuenta: { type: Number, required: false},
    valor: { type: Number, required: false},
    beneficiario: { type: String, required: false},
    estado: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('PagoProveedor', PagosProveedorSchema);