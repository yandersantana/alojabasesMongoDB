const { Router } = require('express');
const router = Router();
const ParametrizacionesSuc = require('../models/parametrizacionesSucursales')

router.get('/getParametrizaciones', async (req, res) => {
    const parametrizaciones = await ParametrizacionesSuc.find();
    res.send(parametrizaciones)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const parametrizacion = {
        sucursal: req.body.sucursal,
        ruc: req.body.ruc,
        razon_social: req.body.razon_social,
        sri: req.body.sri,
        fecha: req.body.fecha,
        nombre: req.body.nombre,
        contactoPrincipal: req.body.contactoPrincipal,
        celularPrincipal: req.body.celularPrincipal,
        inicio: req.body.inicio,
        fin: req.body.fin,
        direccion: req.body.direccion,
        telefonos: req.body.telefonos
    };
    await ParametrizacionesSuc.findByIdAndUpdate(id, {$set: parametrizacion}, {new: true});
    res.json({status: 'Opciones Actualizado'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await ParametrizacionesSuc.findByIdAndRemove(req.params.id);
    res.json({status: 'opciones Eliminado'});
})


router.post('/newParametrizacion', async (req, res) => {
    const newParametrizacion= new ParametrizacionesSuc({ 
        sucursal: req.body.sucursal,
        ruc: req.body.ruc,
        razon_social: req.body.razon_social,
        sri: req.body.sri,
        fecha: req.body.fecha,
        inicio: req.body.inicio,
        fin: req.body.fin,
        nombre: req.body.nombre,
        contactoPrincipal: req.body.contactoPrincipal,
        celularPrincipal: req.body.celularPrincipal,
        direccion: req.body.direccion,
        telefonos: req.body.telefonos 
        });
    await newParametrizacion.save();
    res.json({status: 'Opciones creado'});
});


module.exports = router;