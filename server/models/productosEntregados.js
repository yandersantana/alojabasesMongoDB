const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductosPendientesSchema = require('../models/productosPendientes').schema;

const ProductosEntregadosSchema = new Schema({
    id: { type: Number, required: false},
    id_documento: { type: Number, required: false},
    productoPorEntregar: { type: ProductosPendientesSchema, required: false},
    cajas: { type: Number, required: false},
    piezas: { type: Number, required: false},
    m2: { type: Number, required: false},
    fecha: { type: String, required: false},
    identrega: { type: Number, required: false},
    estado: { type: String, required: false},
    notas: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ProductosEntregados', ProductosEntregadosSchema);





