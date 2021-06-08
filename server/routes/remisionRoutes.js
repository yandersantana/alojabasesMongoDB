const { Router } = require('express');
const router = Router();
const Remision = require('../models/remisionProducto')

router.get('/getRemisiones', async (req, res) => {
    const remisiones = await Remision.find();
    res.send(remisiones)      
})

router.post('/getRemisionesMensuales', async (req, res,next) => {
    var start = req.body.fechaAnterior;
    var end = req.body.fechaActual;
    const remisiones = await Remision.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    })
    res.json(remisiones)      
})


router.post('/getRemisionEspecifica/:ordenId', async (req, res,next) => {
    var ordenId = req.body.num_orden;
    const remision = await Remision.find({num_orden: ordenId })
    res.json(remision)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const remision = {
        num_orden: req.body.num_orden,
        num_FactPro: req.body.num_FactPro,
        fechaP: req.body.fechaP,
        num_remEnt: req.body.num_remEnt,
        fechaRecibo:req.body.fechaRecibo,
        id_remision:req.body.id_remision,
        placa:req.body.placa,
        nombre_transportador:req.body.nombre_transportador,
        nombre_recibe:req.body.nombre_recibe,
        sucursal:req.body.sucursal,
        nombre_proveedor:req.body.nombre_proveedor,
        estado:req.body.estado,
        bodega:req.body.bodega,
        msjAdmin:req.body.msjAdmin,
        total:req.body.total
    };
    await Remision.findByIdAndUpdate(id, {$set: remision}, {new: true});
    res.json({status: 'Ìndice Actualizado'});  
})

router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await Remision.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'Ìndice Actualizado'});  
})

router.put('/updateRechazarRemi/:id/:estado/:mensaje', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { mensaje } = req.params;
    await Remision.findByIdAndUpdate(id, {$set: {estado:estado,msjAdmin:mensaje}}, {new: true});
    res.json({status: 'Ìndice Actualizado'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Remision.findByIdAndRemove(req.params.id);
    res.json({status: 'Remision Eliminado'});
})


router.post('/newRemision', async (req, res) => {
    //const { index_name, index_description, index_type,index_length } = req.body;
    const newRemision= new Remision({ 
        num_orden: req.body.num_orden,
        num_FactPro: req.body.num_FactPro,
        fechaP: req.body.fechaP,
        num_remEnt: req.body.num_remEnt,
        fechaRecibo:req.body.fechaRecibo,
        id_remision:req.body.id_remision,
        placa:req.body.placa,
        nombre_transportador:req.body.nombre_transportador,
        nombre_recibe:req.body.nombre_recibe,
        sucursal:req.body.sucursal,
        nombre_proveedor:req.body.nombre_proveedor,
        estado:req.body.estado,
        bodega:req.body.bodega,
        msjAdmin:req.body.msjAdmin,
        total:req.body.total
        });
    await newRemision.save();
    res.json({status: 'Remision creada'});
});


module.exports = router;