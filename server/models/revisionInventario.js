const mongoose = require('mongoose');
const { Schema } = mongoose;

const RevisionInventarioSchema = new Schema({
    sucursal: { type: String, required: false},
    responsable: { type: String, required: false},
    idDocumento: { type: Number, required: false},
    estado: { type: String, required: false},
    fecha_inicio: { type: String, required: false},
    nombreClasificacion: { type: String, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('RevisionInventario', RevisionInventarioSchema);

