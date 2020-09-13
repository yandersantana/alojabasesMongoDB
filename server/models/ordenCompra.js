const mongoose = require('mongoose');
const { Schema } = mongoose;
const SucursalSchema = require('../models/sucursal').schema;
const ProveedorSchema = require('../models/proveedor').schema;

const OrdenCompraSchema = new Schema({
    id: { type: Number, required: false},
    fecha: { type: String, required: false},
    usuario: { type: String, required: false},
    usuarioAth: { type: String, required: false},
    fechaEntrega: { type: String, required: false},
    contacto: { type: String, required: false},
    documento: { type: Number, required: false},
    proveedor: { type: ProveedorSchema, required: false},
    sucursal: { type: SucursalSchema, required: false},
    lugarentrega: { type: String, required: false},
    condpago: { type: String, required: false},
    costeUnitaTransport: { type: Number, required: false},
    otrosCostosGen: { type: Number, required: false},
    otrosDescuentosGen: { type: Number, required: false},
    observaciones: { type: String, required: false},
    total: { type: Number, required: false},
    productoDetalle: { type: String, required: false},
    estado: { type: String, required: false},
    subtotal: { type: Number, required: false},
    secuencia: { type: String, required: false},
    n_orden: { type: Number, required: false},
    fechaAP: { type: String, required: false},
    msjAdmin: { type: String, required: false},
    msjGeneral: { type: String, required: false},
    subtotalIva: { type: Number, required: false},
    subtotalDetalles: { type: Number, required: false},
    subtDetalles2: { type: Number, required: false},
    TotalIva: { type: Number, required: false},
    tipo: { type: String, required: false},
    factPro: { type: String, required: false},
    nota: { type: String, required: false},
    estadoOrden: { type: String, required: false},
    estadoIngreso: { type: String, required: false},
    productosComprados: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('OrdenCompra', OrdenCompraSchema);