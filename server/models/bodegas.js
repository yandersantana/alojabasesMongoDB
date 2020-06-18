const mongoose = require('mongoose');
const { Schema } = mongoose;


const BodegasSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false},
    persona_responsable: { type: String, required: false},
    idN: { type: Number, required: false},
    direccion: { type: String, required: false},
    sucursal: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Bodega', BodegasSchema);