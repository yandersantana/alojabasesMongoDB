
const mongoose = require('mongoose');
const { Schema } = mongoose;
const CientesSchema = require('../models/clientes').schema;



const ProformasSchema = new Schema({
    id: { type: Number, required: false},
    documento_n: { type: Number, required: false},
    sucursal: { type: String, required: false},
    fecha: { type: String, required: false},
    fecha2: { type: String, required: false},
    total: { type: Number, required: false},
    username: { type: String, required: false},
    cliente: { type: CientesSchema, required: false},
    tipo_venta: { type: String, required: false},
    tipo_cliente: { type: String, required: false},
    observaciones: { type: String, required: false},
    coste_transporte: { type: Number, required: false},
    dni_comprador: { type: String, required: false},
    totalDescuento: { type: Number, required: false},
    tipoDocumento: { type: String, required: false},
    cotizacion: { type: Number, required: false},
    subtotalF1: { type: Number, required: false},
    subtotalF2: { type: Number, required: false},
    totalIva: { type: Number, required: false},
    totalDescuentos: { type: Number, required: false},
    estado: { type: String, required: false},
    productosVendidos: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Proformas', ProformasSchema);