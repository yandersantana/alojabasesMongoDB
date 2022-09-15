const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransaccionesRevisionesProductoSchema = new Schema({
    idReferenciaRevision: { type: Number, required: false},
    fecha: { type: Date, required: false},
    producto: { type: String, required: false},
    estado: { type: String, required: false},
    detalle: { type: String, required: false},
    novedades: { type: String, required: false},
    cajas_sistema: { type: Number, required: false},
    piezas_sistema: { type: Number, required: false},
    m2_sistema: { type: Number, required: false},
    cajas_conteo:{ type: Number, required: false},
    piezas_conteo: { type: Number, required: false},
    m2_conteo: { type: Number, required: false},
    cajas_diferencia: { type: Number, required: false},
    piezas_diferencia: { type: Number, required: false},
    m2_diferencia: { type: Number, required: false},
    resultado: { type: String, required: false},
    sucursal : { type: String, required: false},
    responsable : { type: String, required: false},
    nombreClasificacion : { type: String, required: false}  
},{
    timestamps:true
});


module.exports = mongoose.model('TransaccionesRevisionesProducto', TransaccionesRevisionesProductoSchema);


