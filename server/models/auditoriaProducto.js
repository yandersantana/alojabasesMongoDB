const mongoose = require('mongoose');
const { Schema } = mongoose;
const SucursalSchema = require('../models/sucursal').schema;
const ProductoSchema = require('../models/producto').schema;

const AuditoriaProductoSchema = new Schema({
    id: { type: Number, required: false},
    idAud: { type: String, required: false},
    nombre_auditor: { type: String, required: false},
    sucursal: { type: SucursalSchema, required: false},
    producto: { type: ProductoSchema, required: false},
    nombreproducto: { type: String, required: false},
    fecha: { type: String, required: false},
    cajas_sistema: { type: Number, required: false},
    piezas_sistema: { type: Number, required: false},
    cajas_fisico: { type: Number, required: false},
    piezas_fisico: { type: Number, required: false},
    cajas_danadas: { type: Number, required: false},
    piezas_danadas: { type: Number, required: false},
    valoracion: { type: String, required: false},
    observaciones: { type: String, required: false}
   
},{
    timestamps:true
});

module.exports = mongoose.model('AuditoriaProducto', AuditoriaProductoSchema);