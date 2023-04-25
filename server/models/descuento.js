const mongoose = require('mongoose');
const { Schema } = mongoose;

const DescuentosSchema = new Schema({
    id: { type: Number, required: false},
    codigo: { type: String, required: false},
    estado: { type: String, required: false},
    generadoPor: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Descuentos', DescuentosSchema);
