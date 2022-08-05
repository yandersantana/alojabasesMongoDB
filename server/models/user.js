const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    id: { type: Number, required: false},
    name: { type: String, required: false},
    username: { type: String, required: false},
    email: { type: String, required: false},
    password: { type: String, required: false},
    rol: { type: String, required: false},
    sucursal: { type: String, required: false},
    status:{ type: String, required: false},
    imageProfile: { type: String, required: false},
    codigo: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('User', UserSchema);