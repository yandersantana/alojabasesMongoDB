const mongoose = require('mongoose');
const { Schema } = mongoose;


const CientesSchema = new Schema({
    id: { type: Number, required: false},
    cliente_nombre: { type: String, required: false},
    t_cliente: { type: String, required: false},
    ruc: { type: String, required: false},
    direccion: { type: String, required: false},
    celular: { type: String, required: false},
    tventa: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Cliente', CientesSchema);