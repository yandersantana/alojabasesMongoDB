const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContadoresSchema = new Schema({
    id: { type: Number, required: false},
    facturaMatriz_Ndocumento: { type: Number, required: false},
    facturaSucursal1_Ndocumento: { type: Number, required: false},
    facturaSucursal2_Ndocumento: { type: Number, required: false},
    proformas_Ndocumento: { type: Number, required: false},
    notasVenta_Ndocumento: { type: Number, required: false},
    transacciones_Ndocumento: { type: Number, required: false},
    ordenesCompra_Ndocumento: { type: Number, required: false},
    ordenesCompraAprobadas_Ndocumento: { type: Number, required: false},
    contFacturaProveedor_Ndocumento: { type: Number, required: false},
    contRemisiones_Ndocumento: { type: Number, required: false},
    pagoProveedor_Ndocumento: { type: Number, required: false}

    
    
},{
    timestamps:true
});

module.exports = mongoose.model('Contadores', ContadoresSchema);