const mongoose = require('mongoose');
const { Schema } = mongoose;

const CientesSchema = new Schema({
    id: { type: Number, required: false},
    cliente_nombre: { type: String, required: false},
    t_cliente: { type: String, required: false},
    tventa: { type: String, required: false},
    ruc: { type: String, required: false},
    direccion: { type: String, required: false},
    celular: { type: String, required: false},
    telefono: { type: String, required: false},
    correo: { type: String, required: false},
    nombreContacto: { type: String, required: false},
    direccionContacto: { type: String, required: false},
    ciudad: { type: String, required: false},
    celularContacto: { type: String, required: false},
    fechaNacimiento: { type: Date, required: false},
    notas: { type: String, required: false},
    regimen: { type: String, required: false},
    forma_pago: { type: String, required: false},
    dias_credito: { type: Number, required: false},
    cupo_maximo: { type: Number, required: false},
    tipoCliente: { type: String, required: false},
    estado: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Cliente', CientesSchema);