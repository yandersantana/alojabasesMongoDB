const mongoose = require('mongoose');
const { Schema } = mongoose;

const CombosSchema = new Schema({
    id: { type: Number, required: false},
    nombreCombo: { type: String, required: false},
    cantidadProductos: { type: Number, required: false},
    arrayProductos: { type: Array, required: false},
    precioVenta: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Combos', CombosSchema);


