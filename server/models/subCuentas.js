const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubCuentaSchema = new Schema({
    id: { type: Number, required: false},
    nombre: { type: String, required: false},
    id_cuenta: { type: String, required: false},
    mcaCajaMenor: { type: Boolean, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('SubCuenta', SubCuentaSchema);