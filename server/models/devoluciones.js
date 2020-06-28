    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const SucursalSchema = require('../models/sucursal').schema;
    
    const DevolucionesSchema = new Schema({
        id: { type: Number, required: false},
        cliente: { type: String, required: false},
        usuario: { type: String, required: false},
        observaciones: { type: String, required: false},
        sucursal: { type: SucursalSchema, required: false},
        fecha: { type: String, required: false},
        fecha_transaccion: { type: String, required: false},
        id_devolucion: { type: Number, required: false},
        totalDevolucion: { type: Number, required: false},
        num_documento: { type: Number, required: false},
        tipo_documento: { type: String, required: false},
        estado: { type: String, required: false},
        productosDevueltos: { type: Array, required: false}
    },{
        timestamps:true
    });
    
    module.exports = mongoose.model('Devoluciones', DevolucionesSchema);

