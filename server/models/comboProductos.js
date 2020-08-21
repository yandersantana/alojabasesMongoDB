const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductoSchema = require('../models/producto').schema;

const ProductosCombosSchema = new Schema({
    id: { type: Number, required: false},
    producto: { type: ProductoSchema, required: false},
    nombreProducto: { type: String, required: false},
    cantidad: { type: Number, required: false},
    precioMin: { type: Number, required: false},
    costo: { type: Number, required: false},
    precioCombo: { type: Number, required: false},
    precioVenta: { type: Number, required: false},
    calculo: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ProductosCombos', ProductosCombosSchema);

