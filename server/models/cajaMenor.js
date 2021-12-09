const mongoose = require('mongoose');
const { Schema } = mongoose;

const CajaMenorSchema = new Schema({
    idDocumento: { type: Number, required: false},
    fecha: { type: String, required: false},
    usuario: { type: String, required: false},
    sucursal: { type: String, required: false},
    estado: { type: String, required: false},
    totalIngresos: { type: Number, required: false},
    totalSalidas: { type: Number, required: false},
    totalRC: { type: Number, required: false},
    resultado: { type: Number, required: false},
    estadoCaja: { type: String, required: false},
},{
    timestamps:true
});

module.exports = mongoose.model('CajaMenor', CajaMenorSchema);