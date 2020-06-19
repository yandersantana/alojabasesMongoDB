const { Router } = require('express');
const router = Router();
const Baja = require('../models/baja')

router.post('/newBaja2', async (req, res) => {
    console.log("entreeeeee")
    const newbaja = new Baja({ 
        usuario:req.body.usuario, 
        observaciones:req.body.observaciones, 
        sucursal:req.body.sucursal,
        fecha:req.body.fecha,
        fecha_transaccion:req.body.fecha_transaccion,
        id_baja:req.body.id_baja,
        totalBajas:req.body.totalBajas,
        estado:req.body.estado,
        productosBaja:req.body.productosBaja});
    await newbaja.save();
    res.json({status: 'Cliente creado'});
});



router.get('/getBajas', async (req, res) => {
    const bajas = await Baja.find();
    res.send(bajas)      
})


router.put('/updateEstadoBaja/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await Baja.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newbodega ={ 
        usuario:req.body.usuario, 
        observaciones:req.body.observaciones, 
        sucursal:req.body.sucursal,
        fecha:req.body.fecha,
        fecha_transaccion:req.body.fecha_transaccion,
        id_baja:req.body.id_baja,
        totalBajas:req.body.totalBajas,
        estado:req.body.estado,
        productosBaja:req.body.productosBaja};
    await Baja.findByIdAndUpdate(id, {$set: newbodega}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Baja.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

