const mongoose = require('mongoose');
const { Schema } = mongoose;

const PrestamosSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: Date, required: false},
    sucursal: { type: String, required: false},
    beneficiario: { type: String, required: false},
    ruc: { type: String, required: false},
    comprobanteId: { type: String, required: false},
    numDocumento: { type: String, required: false},
    valor: { type: Number, required: false},
    valorDeuda: { type: Number, required: false},
    estado: { type: String, required: false},
    notas: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Prestamos', PrestamosSchema);
