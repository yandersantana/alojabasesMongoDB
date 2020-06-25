const { Router } = require('express');
const router = Router();
const Precios = require('../models/precios')

router.get('/getPrecios', async (req, res) => {
    const precios = await Precios.find();
    res.send(precios)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const precio = {
        aplicacion: req.body.aplicacion,
        cantidad1: req.body.cantidad1,
        porcentaje1: req.body.porcentaje1,
        cantidad2: req.body.cantidad2,
        porcentaje2: req.body.porcentaje2};
    console.log("llegue hasta aquu")
    await Precios.findByIdAndUpdate(id, {$set: precio}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await PagoProveedor.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newPrecio', async (req, res) => {
   const newPrecio = new Precios({
        aplicacion: req.body.aplicacion,
        cantidad1: req.body.cantidad1,
        porcentaje1: req.body.porcentaje1,
        cantidad2: req.body.cantidad2,
        porcentaje2: req.body.porcentaje2});
    await newPrecio.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;