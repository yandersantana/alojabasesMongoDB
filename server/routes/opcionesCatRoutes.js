const { Router } = require('express');
const router = Router();
const OpcionesCat = require('../models/opcionesCatalogo')

router.get('/getOpciones', async (req, res) => {
    const opcionesCat = await OpcionesCat.find();
    res.send(opcionesCat)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const opciones = {
        arrayClasificación: req.body.arrayClasificación,
        arrayUnidades: req.body.arrayUnidades,
        arrayNombreComercial: req.body.arrayNombreComercial
    };
    await OpcionesCat.findByIdAndUpdate(id, {$set: opciones}, {new: true});
    res.json({status: 'Opciones Actualizado'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await OpcionesCat.findByIdAndRemove(req.params.id);
    res.json({status: 'opciones Eliminado'});
})


router.post('/newOpcionesCat', async (req, res) => {
    //const { index_name, index_description, index_type,index_length } = req.body;
    const newOpciones= new OpcionesCat({ 
        arrayClasificación: req.body.arrayClasificación,
        arrayUnidades: req.body.arrayUnidades,
        arrayNombreComercial: req.body.arrayNombreComercial
        });
    await newOpciones.save();
    res.json({status: 'Opciones creado'});
});


module.exports = router;