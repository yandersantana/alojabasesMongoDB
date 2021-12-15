const mongoose = require('mongoose');
const { Schema } = mongoose;

const BeneficiarioSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Beneficiario', BeneficiarioSchema);