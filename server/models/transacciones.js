const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransaccionesSchema = new Schema({
    id: { type: Number, required: false},
    idTransaccion: { type: Number, required: false},
    fecha_transaccion: { type: Date, required: false},
    fecha_mov: { type: String, required: false},
    sucursal: { type: String, required: false},
    bodega: { type: String, required: false},
    tipo_transaccion: { type: String, required: false},
    totalsuma: { type: String, required: false},
    documento: { type: String, required: false},
    rucSucursal:{ type: String, required: false},
    producto: { type: String, required: false},
    cajas: { type: String, required: false},
    piezas: { type: String, required: false},
    usu_autorizado: { type: String, required: false},
    usuario: { type: String, required: false},
    observaciones: { type: String, required: false},
    factPro: { type: String, required: false},
    costo_unitario: { type: Number, required: false},
    valor: { type: String, required: false},
    cliente: { type: String, required: false},
    proveedor: { type: String, required: false},
    maestro: { type: String, required: false},
    orden_compra: { type: String, required: false},
    cantM2: { type: String, required: false},
    movimiento: { type: String, required: false},
    mcaEntregado: { type: String, required: false},
    nombreUsuario: { type: String, required: false},
    nombreVendedor: { type: String, required: false},
    isActive: { type: Boolean, required: false}
    
    
},{
    timestamps:true
});

module.exports = mongoose.model('Transacciones', TransaccionesSchema);


