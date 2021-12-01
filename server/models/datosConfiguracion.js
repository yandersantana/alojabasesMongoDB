
const mongoose = require('mongoose');
const { Schema } = mongoose;
const DatosConfiguracionSchema = new Schema({
    id: { type: Number, required: false},
    urlImage: { type: String, required: false}  
},{
    timestamps:true
});

module.exports = mongoose.model('DatosConfiguracion', DatosConfiguracionSchema);


