const { Router } = require('express');
const router = Router();
const Cuenta = require('../models/cuentas')

router.post('/newCuenta', async (req, res) => {
    const newCuenta = new Cuenta({ 
        nombre:req.body.nombre,
        tipoCuenta: req.body.tipoCuenta});
    await newCuenta.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getCuentas', async (req, res) => {
    const cuenta = await Cuenta.find();
    res.send(cuenta)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCuenta ={ 
        nombre:req.body.nombre,
        tipoCuenta: req.body.tipoCuenta};
    await Cuenta.findByIdAndUpdate(id, {$set: newCuenta}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Cuenta.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

