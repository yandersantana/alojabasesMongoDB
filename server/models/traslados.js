const mongoose = require('mongoose');
const { Schema } = mongoose;
const Sucursal = require('../models/sucursal')

const TrasladosSchema = new Schema({
    id: { type: Number, required: false},
    id_traslado: { type: Number, required: false},
    nombre_transportista: { type: String, required: false},
    identificacion: { type: String, required: false},
    celular: { type: String, required: false},
    tipo_vehiculo: { type: String, required: false},
    placa: { type: String, required: false},
    sucursal_origen: { type: Sucursal, required: false},
    bodega_origen: { type: String, required: false},
    sucursal_destino: { type: Sucursal, required: false},
    bodega_destino: { type: String, required: false},
    observaciones: { type: String, required: false},
    fecha: { type: String, required: false},
    estado: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Traslados', TrasladosSchema);


