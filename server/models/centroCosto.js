const mongoose = require('mongoose');
const { Schema } = mongoose;

const CentroCostoSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('CentroCosto', CentroCostoSchema);