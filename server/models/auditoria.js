const mongoose = require('mongoose');
const { Schema } = mongoose;
const SucursalSchema = require('../models/sucursal').schema;

const AuditoriaSchema = new Schema({
    id: { type: Number, required: false},
    idAuditoria: { type: Number, required: false},
    contrasena: { type: String, required: false},
    sucursal: { type: SucursalSchema, required: false},
    cantidad_productos: { type: Number, required: false},
    fecha_inicio: { type: Date, required: false},
    fecha_fin: { type: Date, required: false},
    auditado: { type: String, required: false},
    estado: { type: String, required: false}
   
},{
    timestamps:true
});

module.exports = mongoose.model('Auditoria', AuditoriaSchema);