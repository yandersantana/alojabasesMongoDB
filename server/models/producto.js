
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoSchema = new Schema({
    id: { type: Number, required: false},
    CAL: { type: String, required: false},
    CASA: { type: String, required: false},
    CLASIFICA: { type: String, required: false},
    ESTADO: { type: String, required: false},
    M2: { type: Number, required: false},
    P_CAJA: { type: Number, required: false},
    PRODUCTO: { type: String, required: false},
    REFERENCIA: { type: String, required: false},
    UNIDAD: { type: String, required: false},
    cantidad: { type: Number, required: false},
    precio: { type: Number, required: false},
    porcentaje_ganancia: { type: Number, required: false},
    nombre_comercial: { type: String, required: false},
    sucursal1: { type: Number, required: false},
    sucursal2: { type: Number, required: false},
    sucursal3: { type: Number, required: false},
    suc1Pendiente: { type: Number, required: false},
    suc2Pendiente: { type: Number, required: false},
    suc3Pendiente: { type: Number, required: false},
    bodegaProveedor: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Producto', ProductoSchema);
