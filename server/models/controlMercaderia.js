const mongoose = require('mongoose');
const { Schema } = mongoose;


const ControlMercaderiaSchema = new Schema({
    id: { type: String, required: false},
    nombreGrupo: { type: String, required: false},
    piezasRestantes: { type: Number, required: false},
    cajasLimite: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ControlMercaderia', ControlMercaderiaSchema);