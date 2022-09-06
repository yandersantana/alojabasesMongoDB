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
    piezas: { type: Number, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('RevisionInventarioProducto', RevisionInventarioProductoSchema);

