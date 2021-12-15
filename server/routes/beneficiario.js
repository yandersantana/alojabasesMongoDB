const { Router } = require('express');
const router = Router();
const Beneficiario = require('../models/beneficiario')

router.post('/newBeneficiario', async (req, res) => {
    const newBeneficiario = new Beneficiario({ 
        nombre:req.body.nombre});
    await newBeneficiario.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getBeneficiarios', async (req, res) => {
    const beneficiarios = await Beneficiario.find();
    res.send(beneficiarios)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newBeneficiario ={ 
        nombre:req.body.nombre};
    await Beneficiario.findByIdAndUpdate(id, {$set: newBeneficiario}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Beneficiario.findByIdAndRemove(req.params.id);
    res.json({status: 'Detalle Eliminado'});
})


module.exports = router;

