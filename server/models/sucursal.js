
const mongoose = require('mongoose');
const { Schema } = mongoose;


const SucursalSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false},
    contacto: { type: String, required: false},
    celular: { type: String, required: false},
    direccion: { type: String, required: false}
   
},{
    timestamps:true
});

module.exports = mongoose.model('Sucursal', SucursalSchema);


