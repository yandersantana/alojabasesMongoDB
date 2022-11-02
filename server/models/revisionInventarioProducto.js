const mongoose = require('mongoose');
const { Schema } = mongoose;

const RevisionInventarioProductoSchema = new Schema({
    idReferenciaRevision: { type: Number, required: false},
    producto: { type: String, required: false},
    fecha: { type: Date, required: false},
    estado: { type: String, required: false},
    detalle: { type: String, required: false},
    novedades: { type: String, required: false},
    cajas: { type: Number, required: false},
    piezas: { type: Number, required: false},
    m2_conteo: { type: Number, required: false},
    cajas_sistema: { type: Number, required: false},
    piezas_sistema: { type: Number, required: false},
    m2_sistema: { type: Number, required: false},
    cajas_diferencia: { type: Number, required: false},
    piezas_diferencia: { type: Number, required: false},
    m2_diferencia: { type: Number, required: false},
    resultado: { type: String, required: false},
    estadoRevision: { type: String, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('RevisionInventarioProducto', RevisionInventarioProductoSchema);

