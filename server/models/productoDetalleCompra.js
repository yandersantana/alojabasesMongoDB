
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductoSchema = require('../models/producto').schema;

const ProductoDetalleCompraSchema = new Schema({
    id: { type: Number, required: false},
    seleccionado: { type: Boolean, required: false},
    iva: { type: Boolean, required: false},
    nombreComercial: { type: ProductoSchema, required: false},
    rotacion: { type: String, required: false},
    disponible: { type: Number, required: false},
    precio_cos: { type: Number, required: false},
    cantidad: { type: String, required: false},
    precio_compra: { type: Number, required: false},
    desct: { type: String, required: false},
    total: { type: Number, required: false},
    orden_compra: { type: Number, required: false},
    solicitud_n: { type: Number, required: false},
    subtotal: { type: String, required: false},
    subtIva: { type: Number, required: false},
    subtDet: { type: Number, required: false},
    subtDetP: { type: Number, required: false},
    equivalencia: { type: String, required: false},
    descGeneral: { type: Number, required: false},
    descProducto: { type: Number, required: false},
    estado_remision: { type: String, required: false},
    estado_factura: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ProductosComprados', ProductoDetalleCompraSchema);
