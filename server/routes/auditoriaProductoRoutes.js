const { Router } = require('express');
const router = Router();
const AuditoriaProducto = require('../models/auditoriaProducto')


router.post('/newAuditoriaProducto', async (req, res) => {
    const newAuditoria = new AuditoriaProducto({ 
      idAud:req.body.idAud, 
      nombre_auditor:req.body.nombre_auditor, 
      sucursal:req.body.sucursal,
      producto:req.body.producto,
      fecha:req.body.fecha,
      nombreproducto:req.body.nombreproducto,
      cajas_sistema:req.body.cajas_sistema,
      piezas_sistema:req.body.piezas_sistema,
      cajas_fisico:req.body.cajas_fisico,
      piezas_fisico:req.body.piezas_fisico,
      cajas_danadas:req.body.cajas_danadas,
      piezas_danadas:req.body.piezas_danadas,
      valoracion:req.body.valoracion,
      observaciones:req.body.observaciones
    });
    await newAuditoria.save();
    res.json({status: 'Cliente creado'});
});



router.get('/getAuditorias', async (req, res) => {
    const auditorias = await AuditoriaProducto.find();
    res.send(auditorias)      
})


router.put('/updateAuditoria/:id/:cantidad', async (req, res,next) => {
    const { id } = req.params;
    const { cantidad } = req.params;
    await AuditoriaProducto.findByIdAndUpdate(id, {$set: {cantidad_productos:cantidad}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateAuditoriaEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await AuditoriaProducto.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})



router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newAudit ={ 
      idAud:req.body.idAud, 
      nombre_auditor:req.body.nombre_auditor, 
      sucursal:req.body.sucursal,
      fecha:req.body.fecha,
      producto:req.body.producto,
      nombreproducto:req.body.nombreproducto,
      cajas_sistema:req.body.cajas_sistema,
      piezas_sistema:req.body.piezas_sistema,
      cajas_fisico:req.body.cajas_fisico,
      piezas_fisico:req.body.piezas_fisico,
      cajas_danadas:req.body.cajas_danadas,
      piezas_danadas:req.body.piezas_danadas,
      valoracion:req.body.valoracion,
      observaciones:req.body.observaciones};
    await AuditoriaProducto.findByIdAndUpdate(id, {$set: newAudit}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await AuditoriaProducto.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

