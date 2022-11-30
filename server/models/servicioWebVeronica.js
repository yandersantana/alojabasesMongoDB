
const mongoose = require('mongoose');
const { Schema } = mongoose;


const ServicioWebVeronicaSchema = new Schema({
    objetoRequest: { type: String, required: false},
    objetoResponse: { type: String, required: false},
    nroDocumento: { type: String, required: false},
    sucursal: { type: String, required: false},
    resultado: { type: String, required: false},
    claveAcceso: { type: String, required: false},
    fecha: { type: Date, required: false}   
},{
    timestamps:true
});

module.exports = mongoose.model('ServicioWebVeronica', ServicioWebVeronicaSchema);


