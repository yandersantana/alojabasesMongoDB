const { Router } = require('express');
const router = Router();
const Traslados = require('../models/traslados')

router.get('/getTraslados', async (req, res) => {
    const traslados = await Traslados.find();
    res.send(traslados)      
})


router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await Traslados.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'Sucursal Actualizada'});  
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const traslados = {
        idTransaccion: req.body.idTransaccion,
        id_traslado: req.body.id_traslado,
        nombre_transportista: req.body.nombre_transportista,
        identificacion: req.body.identificacion,
        celular: req.body.celular,
        tipo_vehiculo: req.body.tipo_vehiculo,
        placa: req.body.placa,
        sucursal_origen: req.body.sucursal_origen,
        sucursal_destino: req.body.sucursal_destino,
        bodega_destino: req.body.bodega_destino,
        bodega_origen: req.body.bodega_origen,
        observaciones: req.body.observaciones,
        usuario: req.body.usuario,
        observaciones: req.body.observaciones,
        fecha: req.body.fecha,
        estado: req.body.estado,
        detalleTraslados:req.body.detalleTraslados
    };
    await Traslados.findByIdAndUpdate(id, {$set: traslados}, {new: true});
    res.json({status: 'Sucursal Actualizada'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Traslados.findByIdAndRemove(req.params.id);
    res.json({status: 'Sucursal Eliminada'});
})


router.post('/newTraslado', async (req, res) => {
    const newTraslado= new Traslados({ 
        idTransaccion: req.body.idTransaccion,
        id_traslado: req.body.id_traslado,
        idT: req.body.idT,
        transportista: req.body.transportista,
        sucursal_origen: req.body.sucursal_origen,
        sucursal_destino: req.body.sucursal_destino,
        bodega_destino: req.body.bodega_destino,
        bodega_origen: req.body.bodega_origen,
        observaciones: req.body.observaciones,
        usuario: req.body.usuario,
        observaciones: req.body.observaciones,
        fecha: req.body.fecha,
        estado: req.body.estado,
        detalleTraslados:req.body.detalleTraslados
        });
    await newTraslado.save();
    res.json({status: 'Sucursal creado'});
});


module.exports = router;