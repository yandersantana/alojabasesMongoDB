
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductoSchema = require('../models/producto').schema;

const ProductoVendidosSchema = new Schema({
    id: { type: Number, required: false},
    cantidad: { type: Number, required: false},
    disponible: { type: Number, required: false},
    entregar: { type: Boolean, required: false},
    equivalencia: { type: String, required: false},
    iva: { type: Boolean, required: false},
    producto: { type: ProductoSchema, required: false},
    pedir: { type: Boolean, required: false},
    seleccionado: { type: Boolean, required: false},
    precio_min: { type: Number, required: false},
    precio_venta: { type: Number, required: false},
    total: { type: Number, required: false},
    tipo_documento_emitido: { type: String, required: false},
    factura_id: { type: Number, required: false},
    descuento: { type: Number, required: false},
    subtotal: { type: Number, required: false},
    tipoDocumentoVenta: { type: String, required: false},
    subtP2: { type: Number, required: false},
    subtP1: { type: Number, required: false},
    subtIva: { type: Number, required: false},
    sucursal: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ProductosVendidos', ProductoVendidosSchema);
