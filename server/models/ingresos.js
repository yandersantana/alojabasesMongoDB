const mongoose = require('mongoose');
const { Schema } = mongoose;

const IngresosSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: Date, required: false},
    sucursal: { type: String, required: false},
    depositos: { type: Number, required: false},
    notas: { type: Array, required: false},
    valor: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Ingreso', IngresosSchema);