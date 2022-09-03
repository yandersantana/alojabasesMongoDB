const { Router } = require('express');
const router = Router();
const RevisionInventario = require('../models/revisionInventario')

router.post('/newRevisionInventario', async (req, res) => {
    const newRevision = new RevisionInventario({ 
      sucursal:req.body.sucursal, 
      responsable:req.body.responsable, 
      idDocumento:req.body.idDocumento,
      estado:req.body.estado,
      fecha_inicio:req.body.fecha_inicio,
      nombreClasificacion:req.body.nombreClasificacion});
    await newRevision.save();
    res.json({status: 'Revision creada'});
});



router.get('/getRevisiones', async (req, res) => {
    const revisiones = await RevisionInventario.find();
    res.send(revisiones)      
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

