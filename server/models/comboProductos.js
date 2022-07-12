const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductosCombosSchema = new Schema({
    id: { type: Number, required: false},
    PRODUCTO: { type: String, required: false},
    CLASIFICA: { type: String, required: false},
    precio: { type: Number, required: false},
    estado: { type: String, required: false},
    cantidadProductos: { type: Number, required: false},
    productosCombo: { type: Array, required: false}
},{
    timestamps:true
});


module.exports = mongoose.model('ProductosCombos', ProductosCombosSchema);

