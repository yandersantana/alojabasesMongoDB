const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductosObsequioSchema = new Schema({
    id: { type: Number, required: false},
    cantidad: { type: Number, required: false},
    cantidadpiezas: { type: Number, required: false},
    cantidadM2: { type: Number, required: false},
    producto: { type: String, required: false},
    idfactura: { type: String, required: false},
    proveedor: { type: String, required: false},
    fecha: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ProductosObsequio', ProductosObsequioSchema);


