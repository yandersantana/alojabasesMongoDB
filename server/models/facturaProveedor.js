const mongoose = require('mongoose');
const { Schema } = mongoose;

const FacturaProveedorSchema = new Schema({
    id: { type: String, required: false},
    idF: { type: Number, required: false},
    fecha: { type: Date, required: false},
    fechaExpiracion: { type: String, required: false},
    nFactura: { type: String, required: false},
    nSolicitud: { type: Number, required: false},
    total: { type: Number, required: false},
    valorAbonado: { type: Number, required: false},
    valorPagado: { type: Number, required: false},
    proveedor: { type: String, required: false},
    productos: { type: Array, required: false},
    estado: { type: String, required: false},
    estado2: { type: String, required: false},
    estado3: { type: String, required: false},
    documento_solicitud: { type: Number, required: false},
    valorDescuento: { type: Number, required: false},
    observaciones: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('FacturaProveedor', FacturaProveedorSchema);