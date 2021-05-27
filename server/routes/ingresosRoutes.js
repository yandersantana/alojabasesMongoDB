
const { Router } = require('express');
const router = Router();
const Ingreso = require('../models/ingresos');
const { runInNewContext } = require('vm');

router.post('/newIngreso', async (req, res) => {
    const newIngreso = new Ingreso({ 
        fecha:req.body.fecha, 
        sucursal:req.body.sucursal, 
        depositos:req.body.depositos,
        valor:req.body.valor,
        notas:req.body.notas
    });
    await newIngreso.save();
    res.json({status: 'Ingreso creado'});
});


router.get('/getIngreso/:id', async (req, res) => {
    const { id } = req.params;
    const ingreso = await Ingerso.findById(id);
    res.json(ingreso); 
})

router.get('/getIngresos', async (req, res) => {
    const ingresos = await Ingreso.find();
    res.send(ingresos)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newIngreso ={ 
        fecha:req.body.fecha, 
        sucursal:req.body.sucursal, 
        depositos:req.body.depositos,
        notas:req.body.notas,
        valor:req.body.valor};
    await Ingreso.findByIdAndUpdate(id, {$set: newIngreso}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Ingreso.findByIdAndRemove(req.params.id);
    res.json({status: 'Ingreso Eliminado'});
})


module.exports = router;

