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
    pagoProveedor_Ndocumento: { type: Number, required: false},
    contDevoluciones_Ndocumento: { type: Number, required: false},
    contTraslados_Ndocumento: { type: Number, required: false},
    contBajas_Ndocumento: { type: Number, required: false},
    contProductosPendientes_Ndocumento: { type: Number, required: false},
    contDocumentoEntrega_Ndocumento:{ type: Number, required: false},
    auditorias_Ndocumento:{ type: Number, required: false},
    contProductosEntregadosSucursal_Ndocumento:{ type: Number, required: false},
    reciboCaja_Ndocumento:{ type: Number, required: false},
    comprobantePago_Ndocumento:{ type: Number, required: false},
    cajaMenor_Ndocumento:{ type: Number, required: false}
    
},{
    timestamps:true
});

module.exports = mongoose.model('Contadores', ContadoresSchema);