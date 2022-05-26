const { Router } = require('express');
const router = Router();
const Nota = require('../models/notasPago')

router.post('/newNota', async (req, res) => {
    const newNota = new Nota({ 
        fecha:req.body.fecha, 
        tipo:req.body.tipo, 
        descripcion:req.body.descripcion});
    await newNota.save();
    res.json({status: 'Cliente creado'});
});


router.get('/getNotas', async (req, res) => {
    const notas = await Nota.find();
    res.send(notas)      
})


router.post('/getNotasPorTipo/:tipo', async (req, res) => {
    console.log(req.body)
    const { tipo } = req.params;
    const notas = await Nota.find({tipo: tipo });
    res.send(notas)      
})


router.delete('/delete/:id', async (req, res,next) => {
    await Nota.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

