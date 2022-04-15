const mongoose = require('mongoose');
const { Schema } = mongoose;

const CuentaBancariaSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false},
    numero: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('CuentaBancaria', CuentaBancariaSchema);