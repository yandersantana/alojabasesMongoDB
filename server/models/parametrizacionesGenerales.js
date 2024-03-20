const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParametrizacionesGeneralesSchema = new Schema({
    id: { type: Number, required: false},
    name: { type: String, required: true},
    value: { type: Number, required: true},
},{
    timestamps:true
});

module.exports = mongoose.model('ParametrizacionesGenerales', ParametrizacionesGeneralesSchema);
