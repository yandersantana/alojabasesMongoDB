const mongoose = require('mongoose');
const { Schema } = mongoose;


const PreciosSchema = new Schema({
    id: { type: String, required: false},
    aplicacion: { type: String, required: false},
    cant1: { type: Number, required: false},
    percent1: { type: Number, required: false},
    cant2: { type: Number, required: false},
    percent2: { type: Number, required: false},
    cant3: { type: Number, required: false},
    percent3: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Precios', PreciosSchema);