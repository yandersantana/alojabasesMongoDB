const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransportistaSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false},
    identificacion: { type: String, required: false},
    celular: { type: String, required: false},
    placa: { type: String, required: false},
    vehiculo: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Transportista', TransportistaSchema);




