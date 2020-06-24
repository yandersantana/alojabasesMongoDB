
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductoSchema = require('../models/producto').schema;

const ProductosPendientesSchema = new Schema({
    id: { type: Number, required: false},
    id_Pedido: { type: Number, required: false},
    fecha: { type: String, required: false},
    cliente: { type: String, required: false},
    celular: { type: String, required: false},
    producto: { type: ProductoSchema, required: false},
    documento: { type: Number, required: false},
    sucursal: { type: String, required: false},
    cajas: { type: Number, required: false},
    piezas: { type: Number, required: false},
    cantM2: { type: Number, required: false},
    cajasPen: { type: Number, required: false},
    piezasPen: { type: Number, required: false},
    cantM2Pen: { type: Number, required: false},
    cajasEntregadas: { type: Number, required: false},
    piezasEntregadas: { type: Number, required: false},
    m2Entregados: { type: Number, required: false},
    valor_unitario: { type: Number, required: false},
    total: { type: Number, required: false},
    usuario: { type: String, required: false},
    fechaEntrega: { type: String, required: false},
    estado: { type: String, required: false},
    tipo_documento: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ProductosPendientes', ProductosPendientesSchema);
