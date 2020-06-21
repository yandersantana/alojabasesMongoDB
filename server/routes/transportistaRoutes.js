const { Router } = require('express');
const router = Router();
const Transportista = require('../models/transportista')

router.get('/getTransportista', async (req, res) => {
    const transportista = await Transportista.find();
    res.send(transportista)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const transportista = {
        nombre: req.body.nombre,
        identificacion: req.body.identificacion,
        celular: req.body.celular,
        placa: req.body.placa,
        vehiculo: req.body.vehiculo
    };
    await Transportista.findByIdAndUpdate(id, {$set: transportista}, {new: true});
    res.json({status: 'Sucursal Actualizada'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Transportista.findByIdAndRemove(req.params.id);
    res.json({status: 'Sucursal Eliminada'});
})


router.post('/newTransportista', async (req, res) => {
    const newTransportista= new Transportista({ 
        nombre: req.body.nombre,
        identificacion: req.body.identificacion,
        celular: req.body.celular,
        placa: req.body.placa,
        vehiculo: req.body.vehiculo
        });
    await newTransportista.save();
    res.json({status: 'Sucursal creado'});
});


module.exports = router;