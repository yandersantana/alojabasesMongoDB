const { Router } = require('express');
const router = Router();
const CuentaBancaria = require('../models/cuentaBancaria')

router.post('/newCuenta', async (req, res) => {
    console.log(req)
    const newCuenta = new CuentaBancaria({ 
        nombre: req.body.nombre,
        numero: req.body.numero});
    await newCuenta.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getCuentas', async (req, res) => {
    const cuenta = await CuentaBancaria.find();
    res.send(cuenta)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCuenta ={ 
        nombre:req.body.nombre,
        numero: req.body.numero};
    await CuentaBancaria.findByIdAndUpdate(id, {$set: newCuenta}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await CuentaBancaria.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

