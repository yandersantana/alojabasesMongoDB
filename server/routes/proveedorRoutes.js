const { Router } = require('express');
const router = Router();
const Proveedor = require('../models/proveedor')

router.get('/getProveedores', async (req, res) => {
    const proveedores = await Proveedor.find();
    res.send(proveedores)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const indexes = {
        nombre_proveedor: req.body.nombre_proveedor,
        ruc: req.body.ruc,
        direccion: req.body.direccion,
        celular: req.body.celular,
        contacto:req.body.contacto
    };
    await Proveedor.findByIdAndUpdate(id, {$set: indexes}, {new: true});
    res.json({status: 'Ìndice Actualizado'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Proveedor.findByIdAndRemove(req.params.id);
    res.json({status: 'Proveedor Eliminado'});
})


router.post('/newProveedor', async (req, res) => {
    console.log("si lllll")
    const newProveedor= new Proveedor({ 
        nombre_proveedor: req.body.nombre_proveedor,
        ruc: req.body.ruc,
        direccion: req.body.direccion,
        celular: req.body.celular,
        contacto:req.body.contacto
        });
    await newProveedor.save();
    res.json({status: 'Proveedor creado'});
});


module.exports = router;