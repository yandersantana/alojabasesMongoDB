const { Router } = require('express');
const router = Router();
const PreciosEspeciales = require('../models/preciosEspecial')

router.get('/getPreciosEsp', async (req, res) => {
    const precios = await PreciosEspeciales.find();
    console.log("22 "+precios)
    res.send(precios)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const precio = {
        precioSocio: req.body.precioSocio,
        precioDistribuidor: req.body.precioDistribuidor
    };
    await PreciosEspeciales.findByIdAndUpdate(id, {$set: precio}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await PreciosEspeciales.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newPrecio', async (req, res) => {
   const newPrecio = new PreciosEspeciales({
    precioSocio: req.body.precioSocio,
    precioDistribuidor: req.body.precioDistribuidor});
    await newPrecio.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;