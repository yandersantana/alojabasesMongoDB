const { Router } = require('express');
const router = Router();
const Sucursal = require('../models/sucursal')

router.get('/getSucursales', async (req, res) => {
    const sucursales = await Sucursal.find();
    res.send(sucursales)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const sucursales = {
        nombre: req.body.nombre,
        nombreComercial: req.body.nombreComercial,
        contacto: req.body.contacto,
        celular: req.body.celular,
        direccion: req.body.direccion
    };
    await Sucursal.findByIdAndUpdate(id, {$set: sucursales}, {new: true});
    res.json({status: 'Sucursal Actualizada'});  
})

router.put('/updateNombre/:id/:nombre', async (req, res,next) => {
    const { id } = req.params;
    const sucursales = {
        nombre: req.body.nombre,
        nombreComercial: req.body.nombreComercial,
        contacto: req.body.contacto,
        celular: req.body.celular,
        direccion: req.body.direccion
    };
    await Sucursal.findByIdAndUpdate(id, {$set: sucursales}, {new: true});
    res.json({status: 'Sucursal Actualizada'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Sucursal.findByIdAndRemove(req.params.id);
    res.json({status: 'Sucursal Eliminada'});
})


router.post('/newSucursal', async (req, res) => {
    const newSucursal2= new Sucursal({ 
        nombre: req.body.nombre,
        nombreComercial: req.body.nombreComercial,
        contacto: req.body.contacto,
        celular: req.body.celular,
        direccion: req.body.direccion
        });
    await newSucursal2.save();
    res.json({status: 'Sucursal creado'});
});


module.exports = router;