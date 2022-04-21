const mongoose = require('mongoose');
const { Schema } = mongoose;


const NotasPagoSchema = new Schema({
    fecha: { type: Date, required: false},
    descripcion: { type: String, required: false},
},{
    timestamps:true
});

module.exports = mongoose.model('NotasPago', NotasPagoSchema);