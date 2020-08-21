const { Router } = require('express');
const router = Router();
const Combos = require('../models/combo')

router.post('/newCombo', async (req, res) => {
    const newCombo = new Combos({ 
      nombreCombo:req.body.nombreCombo, 
      cantidadProductos:req.body.cantidadProductos, 
      arrayProductos:req.body.arrayProductos,
      precioVenta:req.body.precioVenta});
    await newCombo.save();
    res.json({status: 'Cliente creado'});
});



router.get('/getCombos', async (req, res) => {
    const combos = await Combos.find();
    res.send(combos)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCombo ={ 
        usuario:req.body.usuario, 
        nombreCombo:req.body.nombreCombo, 
        cantidadProductos:req.body.cantidadProductos, 
        arrayProductos:req.body.arrayProductos,
        precioVenta:req.body.precioVenta};
    await Combos.findByIdAndUpdate(id, {$set: newCombo}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Combos.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

