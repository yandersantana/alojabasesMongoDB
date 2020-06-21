const mongoose = require('mongoose');
const { Schema } = mongoose;
const Sucursal = require('../models/sucursal')
const SucursalSchema = require('../models/sucursal').schema;
const TransportistaSchema = require('../models/transportista').schema;

const TrasladosSchema = new Schema({
    id: { type: Number, required: false},
    idT: { type: Number, required: false},
    id_traslado: { type: Number, required: false},
    transportista: { type: TransportistaSchema, required: false},
    sucursal_origen: { type: SucursalSchema, required: false},
    bodega_origen: { type: String, required: false},
    sucursal_destino: { type: SucursalSchema, required: false},
    bodega_destino: { type: String, required: false},
    observaciones: { type: String, required: false},
    fecha: { type: String, required: false},
    estado: { type: String, required: false},
    detalleTraslados: { type: Array, required: false}
    
},{
    timestamps:true
});

module.exports = mongoose.model('Traslados', TrasladosSchema);


