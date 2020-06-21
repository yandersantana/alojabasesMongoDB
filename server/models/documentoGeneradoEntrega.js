const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductosPendientesSchema = require('../models/productosPendientes').schema;


const DocumentoGeneradoSchema = new Schema({
    id: { type: Number, required: false},
    idDocumento: { type: Number, required: false},
    tipoDocumento: { type: String, required: false},
    Ndocumento: { type: Array, required: false},
    arreEntregas: { type: Number, required: false},
    fecha: { type: String, required: false},
    fechaEntrega: { type: String, required: false},
    observaciones: { type: String, required: false},
    estado: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('DocumentoGenerado', DocumentoGeneradoSchema);





