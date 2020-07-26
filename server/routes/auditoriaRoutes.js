const { Router } = require('express');
const router = Router();
const Auditoria = require('../models/auditoria')

router.post('/newAuditoria', async (req, res) => {
    const newAuditoria = new Auditoria({ 
      idAuditoria:req.body.idAuditoria, 
      contrasena:req.body.contrasena, 
      sucursal:req.body.sucursal,
      cantidad_productos:req.body.cantidad_productos,
      fecha_inicio:req.body.fecha_inicio,
      estado:req.body.estado,
      fecha_fin:req.body.fecha_fin,
      fecha_fin:req.body.fecha_fin});
    await newAuditoria.save();
    res.json({status: 'Cliente creado'});
});



router.get('/getAuditorias', async (req, res) => {
    const auditorias = await Auditoria.find();
    res.send(auditorias)      
})


router.put('/updateAuditoriaCantidad/:id/:cantidad', async (req, res,next) => {
    const { id } = req.params;
    const { cantidad } = req.params;
    await Auditoria.findByIdAndUpdate(id, {$set: {cantidad_productos:cantidad}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateAuditoriaEstado/:id/:estado/:fecha', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { fecha } = req.params;
    await Auditoria.findByIdAndUpdate(id, {$set: {estado:estado,fecha_fin:fecha}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})



router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newAudit ={ 
      idAuditoria:req.body.idAuditoria, 
      contrasena:req.body.contrasena, 
      sucursal:req.body.sucursal,
      cantidad_productos:req.body.cantidad_productos,
      fecha_inicio:req.body.fecha_inicio,
      fecha_fin:req.body.fecha_fin,
      estado:req.body.estado,
      fecha_fin:req.body.fecha_fin};
    await Auditoria.findByIdAndUpdate(id, {$set: newAudit}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Auditoria.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

