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
        cant1: req.body.cant1,
        percent1: req.body.percent1,
        cant2: req.body.cant2,
        percent2: req.body.percent2,
        cant3: req.body.cant3,
        percent3: req.body.percent3
    };
    await Precios.findByIdAndUpdate(id, {$set: precio}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Precios.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newPrecio', async (req, res) => {
   const newPrecio = new Precios({
        aplicacion: req.body.aplicacion,
        cant1: req.body.cant1,
        percent1: req.body.percent1,
        cant2: req.body.cant2,
        percent2: req.body.percent2,
        cant3: req.body.cant3,
        percent3: req.body.percent3});
    await newPrecio.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;