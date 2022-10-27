const { Router } = require('express');
const router = Router();
const StockLocales = require('../models/stockLocales')

router.get('/getProductosStock', async (req, res) => {
    const stock = await StockLocales.find();
    res.send(stock)      
})


router.post('/newProductoStock', async (req, res) => {
    const newProductoStock = new StockLocales({ 
        PRODUCTO: req.body.PRODUCTO,
        CLASIFICA: req.body.CLASIFICA,
        porcentaje: req.body.porcentaje
        });
    await newProductoStock.save();
    res.json({status: 'ProductoStock creado'});
});


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    await StockLocales.findByIdAndUpdate(id, {$set: {porcentaje:req.body.porcentaje}}, {new: true});
    res.json({status: 'StockLocales Actualizada'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await StockLocales.findByIdAndRemove(req.params.id);
    res.json({status: 'Sucursal Eliminada'});
})


router.post("/getProductosPorFiltros", async (req, res, next) => {
  const productos = await StockLocales.find({CLASIFICA: req.body.clasificacion});
  res.json(productos);
});



module.exports = router;