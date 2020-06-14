const mongoose = require('mongoose');
const { Schema } = mongoose;


const OcionesCatalogoSchema = new Schema({
    id: { type: Number, required: false},
    arrayClasificación: { type: Array, required: false},
    arrayUnidades: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('OpcionesCat', OcionesCatalogoSchema);