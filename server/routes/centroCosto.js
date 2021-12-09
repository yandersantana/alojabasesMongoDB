const { Router } = require('express');
const router = Router();
const CentroCosto = require('../models/centroCosto')

router.post('/newCentroCosto', async (req, res) => {
    const newCentroCosto = new CentroCosto({ 
        nombre:req.body.nombre});
    await newCentroCosto.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getCentroCostos', async (req, res) => {
    const centroCosto = await CentroCosto.find();
    res.send(centroCosto)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCentroCosto ={ 
        nombre:req.body.nombre};
    await CentroCosto.findByIdAndUpdate(id, {$set: newCentroCosto}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await CentroCosto.findByIdAndRemove(req.params.id);
    res.json({status: 'Detalle Eliminado'});
})


module.exports = router;

