const mongoose = require('mongoose');
const { Schema } = mongoose;

const CuentaSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false},
    tipoCuenta: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Cuenta', CuentaSchema);