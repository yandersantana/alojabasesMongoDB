const mongoose = require('mongoose');
const { Schema } = mongoose;



const PreciosSchema = new Schema({
    id: { type: String, required: false},
    aplicacion: { type: String, required: false},
    cantidad1: { type: Number, required: false},
    porcentaje1: { type: Number, required: false},
    cantidad2: { type: Number, required: false},
    porcentaje2: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Precios', PreciosSchema);