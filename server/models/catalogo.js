
const mongoose = require('mongoose');
const { Schema } = mongoose;


const CatalogoSchema = new Schema({
    id: { type: Number, required: false},
    PRODUCTO: { type: String, required: false},
    NOMBRE_PRODUCTO: { type: String, required: false},
    CLASIFICA: { type: String, required: false},
    REFERENCIA: { type: String, required: false},
    UNIDAD: { type: String, required: false},
    DIM: { type: String, required: false},
    NOMBRE_COMERCIAL: { type: String, required: false},
    P_CAJA: { type: Number, required: false},
    M2: { type: Number, required: false},
    CAL: { type: String, required: false},
    CASA: { type: String, required: false},
    TIPO: { type: String, required: false},
    ORIGEN: { type: String, required: false},
    APLICACION: { type: String, required: false},
    VIGENCIA: { type: String, required: false},
    FEC_PRODUCCION: { type: String, required: false},
    CANT_MINIMA: { type: Number, required: false},
    porcentaje_ganancia: { type: Number, required: false},
    ESTADO: { type: String, required: false},
    IMAGEN: { type: Array, required: false},
    IMAGEN_PRINCIPAL: { type: String, required: false},
    estado2: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Catalogo', CatalogoSchema);
