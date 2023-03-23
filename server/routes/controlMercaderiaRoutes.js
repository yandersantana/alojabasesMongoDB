const { Router } = require('express');
const router = Router();
const ControlMercaderia = require('../models/controlMercaderia')

router.get('/getParametrizaciones', async (req, res) => {
    const precios = await ControlMercaderia.find();
    res.send(precios)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const parametrizacion = {
        piezasRestantes: req.body.piezasRestantes,
        cajasLimite: req.body.cajasLimite
    };
    await ControlMercaderia.findByIdAndUpdate(id, {$set: parametrizacion}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await ControlMercaderia.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newParametrizacion', async (req, res) => {
   const newParametrizacion = new ControlMercaderia({
        nombreGrupo: req.body.nombreGrupo,
        piezasRestantes: req.body.piezasRestantes,
        cajasLimite: req.body.cajasLimite});
    await newParametrizacion.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;