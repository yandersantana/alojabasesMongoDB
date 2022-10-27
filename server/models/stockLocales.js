const mongoose = require('mongoose');

const StockLocalesSchema = new mongoose.Schema({
    id: { type: Number, required: false},
    PRODUCTO: { type: String, required: false},
    CLASIFICA: { type: String, required: false},
    porcentaje: { type: Number, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('StockLocales', StockLocalesSchema);