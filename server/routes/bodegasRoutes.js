const { Router } = require('express');
const router = Router();
const Bodega = require('../models/bodegas')


router.post('/newBodega', async (req, res) => {
    const newbodega = new Bodega({ 
        nombre:req.body.nombre, 
        persona_responsable:req.body.persona_responsable, 
        direccion:req.body.direccion,
        sucursal:req.body.sucursal});
    await newbodega.save();
    res.json({status: 'Cliente creado'});
});


router.get('/getBodega/:id', async (req, res) => {
    const { id } = req.params;
    const bodegas = await Bodega.findById(id);
    res.json(bodegas); 
})

router.get('/getBodegas', async (req, res) => {
    const bodegas = await Bodega.find();
    res.send(bodegas)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newbodega ={ 
        nombre:req.body.nombre, 
        persona_responsable:req.body.persona_responsable, 
        direccion:req.body.direccion,
        sucursal:req.body.sucursal};
    await Bodega.findByIdAndUpdate(id, {$set: newbodega}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Bodega.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

