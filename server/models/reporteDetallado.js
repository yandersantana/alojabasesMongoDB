const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReporteDetalladoSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: Date, required: false},
    notas: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ReporteDetallado', ReporteDetalladoSchema);