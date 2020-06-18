const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductoSchema = require('../models/producto').schema;

const ProductosIngresadosSchema = new Schema({
    id: { type: Number, required: false},
    nombreComercial: { type: ProductoSchema, required: false},
    cantidadEntregada: { type: Number, required: false},
    cantidadEntregadapiezas: { type: Number, required: false},
    metros2: { type: Number, required: false},
    cantidadSolicitada: { type: Number, required: false},
    cantidadSolicitadacajas: { type: Number, required: false},
    cantidadSolicitadapiezas: { type: Number, required: false},
    observaciones: { type: String, required: false},
    estado: { type: String, required: false},
    cantidadDevuelta: { type: Number, required: false},
    cantidadDevueltapiezas: { type: Number, required: false},
    causaDevolucion: { type: String, required: false},
    numeroOrden: { type: Number, required: false},
    numeroRemision: { type: Number, required: false},
    fecha: { type: String, required: false},
    precio: { type: Number, required: false},
    valorunitario: { type: Number, required: false},
    valortotal: { type: Number, required: false},
    estadoIngreso: { type: String, required: false},
    descuentoGeneral: { type: Number, required: false},
    solicitud_compra: { type: Number, required: false},
    descuentoProducto: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ProductosIngresados', ProductosIngresadosSchema);





