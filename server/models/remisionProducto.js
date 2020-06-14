const mongoose = require('mongoose');
const { Schema } = mongoose;

const RemisionSchema = new Schema({
    id: { type: Number, required: false},
    num_orden: { type: Number, required: false},
    num_FactPro: { type: String, required: false},
    fechaP: { type: String, required: false},
    num_remEnt: { type: String, required: false},
    fechaRecibo: { type: String, required: false},
    id_remision: { type: Number, required: false},
    placa: { type: String, required: false},
    nombre_transportador: { type: String, required: false},
    nombre_recibe: { type: String, required: false},
    sucursal: { type: String, required: false},
    nombre_proveedor: { type: String, required: false},
    estado: { type: String, required: false},
    bodega: { type: String, required: false},
    msjAdmin: { type: String, required: false},
    total: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Remision', RemisionSchema);


