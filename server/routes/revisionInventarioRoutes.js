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
      nombreClasificacion:req.body.nombreClasificacion,
      notas:req.body.notas
    });
    await newRevision.save();
    res.json({status: 'Revision creada'});
});



router.get('/getRevisiones', async (req, res) => {
    const revisiones = await RevisionInventario.find();
    res.send(revisiones)      
})

router.get('/getRevisionesIniciadas', async (req, res) => {
    const revisiones = await RevisionInventario.find({"estado":"Iniciada"});
    res.send(revisiones)      
})


router.post('/getRevisionPorIdConsecutivo', async (req, res, next) => {
  const documentos = await RevisionInventario.find({idDocumento: req.body.idDocumento});
  res.json(documentos);
});


router.put("/updateNota/:id", async (req, res, next) => {
  const { id } = req.params;
  await RevisionInventario.findByIdAndUpdate(id,{ $set: { notas: req.body.notas } },{ new: true });
  res.json({ status: "Cuenta Updated" });
});


router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await RevisionInventario.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
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
    await RevisionInventario.findByIdAndRemove(req.params.id);
    res.json({status: 'RevisionInventario Eliminado'});
})




module.exports = router;

