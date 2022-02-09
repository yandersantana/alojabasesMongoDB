const { Router } = require('express');
const router = Router();
const Devoluciones = require('../models/devoluciones')

router.get('/getDevoluciones', async (req, res) => {
    const devoluciones = await Devoluciones.find();
    res.send(devoluciones)      
})

router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await Devoluciones.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const devoluciones = {
        cliente: req.body.cliente,
        usuario: req.body.usuario,
        observaciones: req.body.observaciones,
        sucursal: req.body.sucursal,
        fecha: req.body.fecha,
        ruc: req.body.ruc,
        fecha_transaccion: req.body.fecha_transaccion,
        id_devolucion:req.body.id_devolucion,
        totalDevolucion:req.body.totalDevolucion,
        num_documento:req.body.num_documento,
        tipo_documento:req.body.tipo_documento,
        estado:req.body.estado,
        productosDevueltos:req.body.productosDevueltos
    };
    await Devoluciones.findByIdAndUpdate(id, {$set: devoluciones}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Devoluciones.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newDevolucion', async (req, res) => {
   const newDevolucion = new Devoluciones({
        cliente: req.body.cliente,
        usuario: req.body.usuario,
        observaciones: req.body.observaciones,
        sucursal: req.body.sucursal,
        fecha: req.body.fecha,
        ruc: req.body.ruc,
        fecha_transaccion: req.body.fecha_transaccion,
        id_devolucion:req.body.id_devolucion,
        totalDevolucion:req.body.totalDevolucion,
        num_documento:req.body.num_documento,
        tipo_documento:req.body.tipo_documento,
        estado:req.body.estado,
        productosDevueltos:req.body.productosDevueltos
    });
    await newDevolucion.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;