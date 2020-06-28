const mongoose = require('mongoose');
const { Schema } = mongoose;


const PreciosEspecialesSchema = new Schema({
    id: { type: Number, required: false},
    precioSocio: { type: Number, required: false},
    precioDistribuidor: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('PreciosEspeciales', PreciosEspecialesSchema);